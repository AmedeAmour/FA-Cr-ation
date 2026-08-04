-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','client');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  city text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "admins read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  short_description text,
  description text,
  material text,
  composition text,
  care text,
  gender text NOT NULL DEFAULT 'femme',
  price_xof integer,
  compare_price_xof integer,
  is_made_to_measure boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "products admin read" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "images public read" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "images admin write" ON public.product_images FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL,
  color text,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants public read" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "variants admin write" ON public.product_variants FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- FAVORITES
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON public.favorites FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approved reviews public" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "own reviews read" ON public.reviews FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own reviews write" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own reviews delete" ON public.reviews FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- DELIVERY ZONES
CREATE TABLE public.delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text NOT NULL DEFAULT 'Abidjan',
  fee_xof integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.delivery_zones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_zones TO authenticated;
GRANT ALL ON public.delivery_zones TO service_role;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "zones public read" ON public.delivery_zones FOR SELECT USING (true);
CREATE POLICY "zones admin write" ON public.delivery_zones FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ORDERS
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('MY-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_method text NOT NULL DEFAULT 'livraison',
  delivery_zone text,
  delivery_address text,
  delivery_fee_xof integer NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'a_la_livraison',
  payment_status text NOT NULL DEFAULT 'en_attente',
  status text NOT NULL DEFAULT 'nouvelle',
  subtotal_xof integer NOT NULL DEFAULT 0,
  total_xof integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders read" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own orders insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "admins manage orders" ON public.orders FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  size text,
  color text,
  quantity int NOT NULL DEFAULT 1,
  unit_price_xof integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own order items read" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "own order items insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "admins manage order items" ON public.order_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- SEED CATEGORIES
INSERT INTO public.categories (name, slug, description, position) VALUES
 ('Chemises en Lin','chemises-lin','Chemises en lin nobles, coupes contemporaines.',1),
 ('Robes & Tuniques','robes-tuniques','Robes longues fluides et tuniques Napié, Kimo Royale.',2),
 ('Tenues Hommes','tenues-hommes','Ensembles et tenues masculines en pagne tissé, lin et batik.',3),
 ('Ensembles','ensembles','Ensembles pantalons et pièces coordonnées.',4),
 ('Édition MASA','edition-masa','Collection événementielle Édition MASA.',5),
 ('LES BÂTISSEURS','les-batisseurs','Collection LES BÂTISSEURS.',6),
 ('Accessoires','accessoires','Écharpes et accessoires en pagne tissé.',7),
 ('Sur mesure','sur-mesure','Pièces uniques réalisées sur mesure.',8);

-- SEED DELIVERY ZONES
INSERT INTO public.delivery_zones (name, region, fee_xof, position) VALUES
 ('Cocody','Abidjan',0,1),('Angré','Abidjan',0,2),('Plateau','Abidjan',0,3),
 ('Marcory','Abidjan',0,4),('Treichville','Abidjan',0,5),('Yopougon','Abidjan',0,6),
 ('Abobo','Abidjan',0,7),('Koumassi','Abidjan',0,8),('Port-Bouët','Abidjan',0,9),
 ('Bingerville','Abidjan',0,10),('Autres villes de Côte d''Ivoire','Intérieur',0,11);

-- SEED PRODUCTS (prix non renseignés : affichés « Sur mesure »)
INSERT INTO public.products (name, slug, category_id, short_description, description, material, composition, care, gender, is_made_to_measure, is_new, is_featured)
SELECT v.name, v.slug, c.id, v.short_description, v.description, v.material, v.composition, v.care, v.gender, true, v.is_new, v.is_featured
FROM (VALUES
 ('Chemise Lin Écru','chemise-lin-ecru','chemises-lin','Chemise en lin lavé, col italien.','Chemise en lin lavé aux finitions artisanales, pensée pour la chaleur d''Abidjan comme pour les soirées habillées.','Lin','100% lin','Lavage à la main ou cycle délicat 30°C, repassage à basse température.','homme',true,true),
 ('Chemise Lin Terracotta','chemise-lin-terracotta','chemises-lin','Chemise en lin teinté naturellement.','Lin teinté naturellement dans une nuance terracotta, coupe droite et boutons discrets.','Lin','100% lin','Lavage délicat 30°C, séchage à l''ombre.','homme',true,false),
 ('Robe Longue Sènè','robe-longue-sene','robes-tuniques','Robe longue fluide en pagne tissé.','Robe longue fluide en pagne tissé à la main, ceinture nouée et tombé architectural.','Pagne tissé','Coton tissé main','Nettoyage à sec recommandé.','femme',true,true),
 ('Tunique Napié','tunique-napie','robes-tuniques','Tunique Napié en batik.','Tunique Napié en batik, coupe ample et broderies fines aux emmanchures.','Batik','Coton batik teinté à la main','Lavage à la main, eau froide, séparément.','femme',true,true),
 ('Kimo Royale','kimo-royale','robes-tuniques','Tunique kimono en pagne tissé.','Kimo Royale : tunique kimono en pagne tissé, ceinture obi et manches amples.','Pagne tissé','Coton tissé main','Nettoyage à sec recommandé.','femme',true,false),
 ('Ensemble Pantalon Baoulé','ensemble-pantalon-baoule','ensembles','Ensemble deux pièces en pagne tissé.','Ensemble deux pièces : veste courte structurée et pantalon fluide en pagne tissé traçable.','Pagne tissé','Coton tissé main','Nettoyage à sec recommandé.','femme',true,false),
 ('Tenue Homme Bâtisseur','tenue-homme-batisseur','tenues-hommes','Tenue masculine deux pièces.','Tenue deux pièces de la collection LES BÂTISSEURS : haut à col mao et pantalon droit.','Pagne tissé','Coton tissé main','Nettoyage à sec recommandé.','homme',true,true),
 ('Boubou Lin Anthracite','boubou-lin-anthracite','tenues-hommes','Boubou contemporain en lin.','Boubou contemporain en lin anthracite, broderies discrètes fil à fil.','Lin','100% lin','Lavage délicat 30°C.','homme',true,false),
 ('Silhouette MASA','silhouette-masa','edition-masa','Pièce de l''Édition MASA.','Pièce d''exception de l''Édition MASA, présentée lors de nos rendez-vous culturels.','Pagne tissé','Coton tissé main','Nettoyage à sec exclusivement.','femme',true,true),
 ('Cape Les Bâtisseurs','cape-les-batisseurs','les-batisseurs','Cape longue en pagne tissé.','Cape longue en pagne tissé, doublure lin, pièce signature de la collection LES BÂTISSEURS.','Pagne tissé','Coton tissé main, doublure lin','Nettoyage à sec exclusivement.','femme',true,false),
 ('Écharpe Pagne Tissé','echarpe-pagne-tisse','accessoires','Écharpe tissée main.','Écharpe en pagne tissé main, teintures naturelles, franges nouées à la main.','Pagne tissé','Coton tissé main','Lavage à la main, eau froide.','femme',true,false),
 ('Pièce Sur Mesure','piece-sur-mesure','sur-mesure','Création entièrement sur mesure.','Création entièrement sur mesure : nous dessinons votre pièce avec vous, du choix du fil aux finitions.','Pagne tissé, lin ou batik','Selon sélection','Selon matière choisie.','femme',true,true)
) AS v(name, slug, cat, short_description, description, material, composition, care, gender, is_new, is_featured)
JOIN public.categories c ON c.slug = v.cat;

INSERT INTO public.product_variants (product_id, size, color, stock)
SELECT p.id, s.size, 'Écru / Terracotta', 3
FROM public.products p CROSS JOIN (VALUES ('XS'),('S'),('M'),('L'),('XL')) AS s(size);

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT p.id, '/images/products/' || p.slug || '.jpg', p.name || ' – Maison Michèle Yakice', 0 FROM public.products p;
INSERT INTO public.product_images (product_id, url, alt, position)
SELECT p.id, '/images/products/detail-' || (1 + (abs(hashtext(p.slug)) % 3)) || '.jpg', p.name || ' – détail du tissu', 1 FROM public.products p;