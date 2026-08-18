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
  region text NOT NULL DEFAULT 'Abomey-Calavi',
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
 ('Pagnes Batik','pagnes-batik','Pagnes batik 100% coton, teints à la main et riches en couleurs.',1),
 ('Robes & Tuniques','robes-tuniques','Pagne tissé, robes, tuniques et créations élégantes pour vos occasions.',2),
 ('Tenues Hommes','tenues-hommes','Ensembles et tenues masculines en pagne tissé, batik et teinture artisanale.',3),
 ('Ensembles','ensembles','Ensembles pantalons et pièces coordonnées.',4),
 ('Teinture Artisanale','teinture-artisanale','Tissus teints à la main, motifs circulaires, linéaires et abstraits.',5),
 ('Créations Sur Mesure','creations-sur-mesure','Tenues uniques créées selon vos envies et vos mesures.',6),
 ('Accessoires','accessoires','Écharpes et accessoires en pagne tissé.',7),
 ('Sur mesure','sur-mesure','Pièces uniques réalisées sur mesure.',8);

-- SEED DELIVERY ZONES
INSERT INTO public.delivery_zones (name, region, fee_xof, position) VALUES
 ('Abomey-Calavi','Atlantique',0,1),('Cotonou','Littoral',0,2),('Porto-Novo','Ouémé',0,3),
 ('Parakou','Borgou',0,4),('Bohicon','Zou',0,5),('Ouidah','Atlantique',0,6),
 ('Lokossa','Mono',0,7),('Natitingou','Atacora',0,8),('Djougou','Donga',0,9),
 ('Autres villes du Bénin','Bénin',0,10);

-- SEED PRODUCTS (prix non renseignés : affichés « Sur mesure »)
INSERT INTO public.products (name, slug, category_id, short_description, description, material, composition, care, gender, is_made_to_measure, is_new, is_featured)
SELECT v.name, v.slug, c.id, v.short_description, v.description, v.material, v.composition, v.care, v.gender, true, v.is_new, v.is_featured
FROM (VALUES
 ('Pagne Batik Violet Royal','chemise-lin-ecru','pagnes-batik','Pagne Abikè violet royal 100% coton.','Motif batik moderne teint à la main, doux, respirant et idéal pour les cérémonies, le bureau ou les sorties.','Batik','100% coton béninois','Lavage à la main ou cycle délicat 30°C, repassage à basse température.','homme',true,true),
 ('Pagne Batik Rouge & Blanc','chemise-lin-terracotta','pagnes-batik','Pagne batik rouge et blanc.','Pagne 100% coton sublimé par des motifs tie-dye originaux, moderne et authentique.','Batik','100% coton béninois','Lavage délicat 30°C, séchage à l''ombre.','homme',true,false),
 ('Pagne Tissé Bleu Gris Blanc','robe-longue-sene','robes-tuniques','Pagne tissé aux rayures bleu, gris et blanc.','Tissu chic, sobre et intemporel, idéal pour robes, ensembles, chemises, vestes et créations sur mesure.','Pagne tissé','Coton tissé main','Nettoyage à sec recommandé.','femme',true,true),
 ('Batik Brun Caramel','tunique-napie','robes-tuniques','Batik artisanal brun, caramel, ocre et ivoire.','Motifs abstraits et raffinés pour chemises, ensembles, robes, vestes, pantalons et tenues de couple.','Batik','Coton batik teinté à la main','Lavage à la main, eau froide, séparément.','femme',true,true),
 ('Pagne Tissé Vert & Blanc','kimo-royale','robes-tuniques','Pagne tissé vert et blanc.','Tissage de qualité, finition soignée et élégante pour mariages, fiançailles, cérémonies et événements culturels.','Pagne tissé','Coton tissé main','Nettoyage à sec recommandé.','femme',true,false),
 ('Pagne Teint Vert Turquoise','ensemble-pantalon-baoule','ensembles','Pagne teint artisanal vert turquoise.','Motifs artistiques uniques, 100% coton béninois, agréable au toucher et adapté aux hommes, femmes et enfants.','Pagne tissé','Coton tissé main','Nettoyage à sec recommandé.','femme',true,false),
 ('Pagne Batik Bleu Roi','tenue-homme-batisseur','tenues-hommes','Pagne batik bleu roi 100% coton.','Teint à la main avec soin, ce bleu paisible donne de la prestance et sublime les créations élégantes.','Pagne tissé','Coton tissé main','Nettoyage à sec recommandé.','homme',true,true),
 ('Pagne Tissé Marron Bleu Royal','boubou-lin-anthracite','tenues-hommes','Pagne tissé marron et bleu royal.','Fond marron chaleureux, large bande bleu royal, fines rayures blanches et touches rouges pour des créations distinguées.','Batik','100% coton béninois','Lavage délicat 30°C.','homme',true,false),
 ('Pagne Tissé Rayures Dorées','silhouette-masa','teinture-artisanale','Pagne tissé aux rayures élégantes.','Rayures bleu profond, blanc, marron et touches dorées pour robes, ensembles, chemises et accessoires.','Pagne tissé','Coton tissé main','Nettoyage à sec exclusivement.','femme',true,true),
 ('Formation Teinture Artisanale','cape-les-batisseurs','creations-sur-mesure','Atelier pratique de teinture artisanale.','Initiation aux motifs circulaires et linéaires, pliage, nouage et application de la teinture au centre Abikè de Parakou.','Pagne tissé','Coton tissé main','Nettoyage à sec exclusivement.','femme',true,false),
 ('Accessoires en Pagne Tissé','echarpe-pagne-tisse','accessoires','Accessoires en pagne tissé.','Écharpes et accessoires en tissu tissé, parfaits pour compléter une tenue avec authenticité.','Pagne tissé','Coton tissé main','Lavage à la main, eau froide.','femme',true,false),
 ('Création Sur Mesure Abikè','piece-sur-mesure','sur-mesure','Création entièrement sur mesure.','Création entièrement sur mesure : nous transformons vos pagnes tissés, batiks et tissus teints en tenues qui vous ressemblent.','Pagne tissé, batik ou teinture artisanale','Selon sélection','Selon matière choisie.','femme',true,true)
) AS v(name, slug, cat, short_description, description, material, composition, care, gender, is_new, is_featured)
JOIN public.categories c ON c.slug = v.cat;

INSERT INTO public.product_variants (product_id, size, color, stock)
SELECT p.id, s.size, 'Selon modèle', 3
FROM public.products p CROSS JOIN (VALUES ('XS'),('S'),('M'),('L'),('XL')) AS s(size);

INSERT INTO public.product_images (product_id, url, alt, position)
SELECT p.id, '/images/products/' || p.slug || '.jpg', p.name || ' – Abikè', 0 FROM public.products p;
INSERT INTO public.product_images (product_id, url, alt, position)
SELECT p.id, '/images/products/detail-' || (1 + (abs(hashtext(p.slug)) % 3)) || '.jpg', p.name || ' – détail du tissu', 1 FROM public.products p;



