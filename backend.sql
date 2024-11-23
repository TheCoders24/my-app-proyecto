PGDMP                   
    |            inventarioventasdb    17.1    17.1 ,    �           0    0    ENCODING    ENCODING     !   SET client_encoding = 'WIN1253';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16434    inventarioventasdb    DATABASE     �   CREATE DATABASE inventarioventasdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Mexico.1252';
 "   DROP DATABASE inventarioventasdb;
                     postgres    false            �            1259    16452    cliente    TABLE     �   CREATE TABLE public.cliente (
    cliente_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100),
    telefono character varying(15)
);
    DROP TABLE public.cliente;
       public         heap r       postgres    false            �            1259    16451    cliente_cliente_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cliente_cliente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.cliente_cliente_id_seq;
       public               postgres    false    222            �           0    0    cliente_cliente_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.cliente_cliente_id_seq OWNED BY public.cliente.cliente_id;
          public               postgres    false    221            �            1259    16477    detalle_venta    TABLE     (  CREATE TABLE public.detalle_venta (
    detalle_venta_id integer NOT NULL,
    venta_id integer,
    producto_id integer,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    subtotal numeric(10,2) GENERATED ALWAYS AS (((cantidad)::numeric * precio_unitario)) STORED
);
 !   DROP TABLE public.detalle_venta;
       public         heap r       postgres    false            �            1259    16476 "   detalle_venta_detalle_venta_id_seq    SEQUENCE     �   CREATE SEQUENCE public.detalle_venta_detalle_venta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.detalle_venta_detalle_venta_id_seq;
       public               postgres    false    226            �           0    0 "   detalle_venta_detalle_venta_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.detalle_venta_detalle_venta_id_seq OWNED BY public.detalle_venta.detalle_venta_id;
          public               postgres    false    225            �            1259    16445    producto    TABLE     �   CREATE TABLE public.producto (
    producto_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    precio numeric(10,2) NOT NULL,
    cantidad_en_inventario integer NOT NULL
);
    DROP TABLE public.producto;
       public         heap r       postgres    false            �            1259    16444    producto_producto_id_seq    SEQUENCE     �   CREATE SEQUENCE public.producto_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.producto_producto_id_seq;
       public               postgres    false    220            �           0    0    producto_producto_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.producto_producto_id_seq OWNED BY public.producto.producto_id;
          public               postgres    false    219            �            1259    16436    users    TABLE     �   CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16435    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public               postgres    false    218            �           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public               postgres    false    217            �            1259    16459    venta    TABLE     �   CREATE TABLE public.venta (
    venta_id integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cliente_id integer,
    user_id integer
);
    DROP TABLE public.venta;
       public         heap r       postgres    false            �            1259    16458    venta_venta_id_seq    SEQUENCE     �   CREATE SEQUENCE public.venta_venta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.venta_venta_id_seq;
       public               postgres    false    224            �           0    0    venta_venta_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.venta_venta_id_seq OWNED BY public.venta.venta_id;
          public               postgres    false    223            2           2604    16455    cliente cliente_id    DEFAULT     x   ALTER TABLE ONLY public.cliente ALTER COLUMN cliente_id SET DEFAULT nextval('public.cliente_cliente_id_seq'::regclass);
 A   ALTER TABLE public.cliente ALTER COLUMN cliente_id DROP DEFAULT;
       public               postgres    false    222    221    222            5           2604    16480    detalle_venta detalle_venta_id    DEFAULT     �   ALTER TABLE ONLY public.detalle_venta ALTER COLUMN detalle_venta_id SET DEFAULT nextval('public.detalle_venta_detalle_venta_id_seq'::regclass);
 M   ALTER TABLE public.detalle_venta ALTER COLUMN detalle_venta_id DROP DEFAULT;
       public               postgres    false    226    225    226            1           2604    16448    producto producto_id    DEFAULT     |   ALTER TABLE ONLY public.producto ALTER COLUMN producto_id SET DEFAULT nextval('public.producto_producto_id_seq'::regclass);
 C   ALTER TABLE public.producto ALTER COLUMN producto_id DROP DEFAULT;
       public               postgres    false    220    219    220            0           2604    16439    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public               postgres    false    217    218    218            3           2604    16462    venta venta_id    DEFAULT     p   ALTER TABLE ONLY public.venta ALTER COLUMN venta_id SET DEFAULT nextval('public.venta_venta_id_seq'::regclass);
 =   ALTER TABLE public.venta ALTER COLUMN venta_id DROP DEFAULT;
       public               postgres    false    223    224    224            �          0    16452    cliente 
   TABLE DATA           F   COPY public.cliente (cliente_id, nombre, email, telefono) FROM stdin;
    public               postgres    false    222   ^4       �          0    16477    detalle_venta 
   TABLE DATA           k   COPY public.detalle_venta (detalle_venta_id, venta_id, producto_id, cantidad, precio_unitario) FROM stdin;
    public               postgres    false    226   {4       �          0    16445    producto 
   TABLE DATA           d   COPY public.producto (producto_id, nombre, descripcion, precio, cantidad_en_inventario) FROM stdin;
    public               postgres    false    220   �4       �          0    16436    users 
   TABLE DATA           <   COPY public.users (user_id, username, password) FROM stdin;
    public               postgres    false    218   �4       �          0    16459    venta 
   TABLE DATA           E   COPY public.venta (venta_id, fecha, cliente_id, user_id) FROM stdin;
    public               postgres    false    224   �4       �           0    0    cliente_cliente_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.cliente_cliente_id_seq', 1, false);
          public               postgres    false    221            �           0    0 "   detalle_venta_detalle_venta_id_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.detalle_venta_detalle_venta_id_seq', 1, false);
          public               postgres    false    225            �           0    0    producto_producto_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.producto_producto_id_seq', 1, false);
          public               postgres    false    219            �           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);
          public               postgres    false    217            �           0    0    venta_venta_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.venta_venta_id_seq', 1, false);
          public               postgres    false    223            >           2606    16457    cliente cliente_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (cliente_id);
 >   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_pkey;
       public                 postgres    false    222            B           2606    16483     detalle_venta detalle_venta_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_pkey PRIMARY KEY (detalle_venta_id);
 J   ALTER TABLE ONLY public.detalle_venta DROP CONSTRAINT detalle_venta_pkey;
       public                 postgres    false    226            <           2606    16450    producto producto_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (producto_id);
 @   ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_pkey;
       public                 postgres    false    220            8           2606    16441    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            :           2606    16443    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    218            @           2606    16465    venta venta_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_pkey PRIMARY KEY (venta_id);
 :   ALTER TABLE ONLY public.venta DROP CONSTRAINT venta_pkey;
       public                 postgres    false    224            E           2606    16489 ,   detalle_venta detalle_venta_producto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.producto(producto_id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.detalle_venta DROP CONSTRAINT detalle_venta_producto_id_fkey;
       public               postgres    false    4668    220    226            F           2606    16484 )   detalle_venta detalle_venta_venta_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_venta_id_fkey FOREIGN KEY (venta_id) REFERENCES public.venta(venta_id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.detalle_venta DROP CONSTRAINT detalle_venta_venta_id_fkey;
       public               postgres    false    224    4672    226            C           2606    16466    venta venta_cliente_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id) ON DELETE SET NULL;
 E   ALTER TABLE ONLY public.venta DROP CONSTRAINT venta_cliente_id_fkey;
       public               postgres    false    222    224    4670            D           2606    16471    venta venta_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;
 B   ALTER TABLE ONLY public.venta DROP CONSTRAINT venta_user_id_fkey;
       public               postgres    false    224    218    4664            �      x������ � �      �      x������ � �      �      x������ � �      �   %   x�3�L,N)N!0�����	 "�db1W� ��      �      x������ � �     