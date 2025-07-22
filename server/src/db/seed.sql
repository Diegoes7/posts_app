--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    description character varying NOT NULL,
    payload jsonb,
    "actorId" integer,
    "timestamp" character varying NOT NULL,
    event character varying NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post (
    id integer NOT NULL,
    title character varying NOT NULL,
    text character varying NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    "creatorId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "popularityPts" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.post OWNER TO postgres;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_id_seq OWNER TO postgres;

--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: updoot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.updoot (
    value integer NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL
);


ALTER TABLE public.updoot OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "ratingPts" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, "createdAt", description, payload, "actorId", "timestamp", event) FROM stdin;
1	2025-07-15 21:15:12.272498	New user registration	{"id": 3, "email": "thor@gmail.com", "username": "Thor oddisson"}	3	2025-07-15T18:15:12.269Z	user.registered-2
2	2025-07-15 22:15:23.45433	New user registration	{"id": 9, "email": "anna@gmail.com", "username": "Anna"}	9	2025-07-15T19:15:23.446Z	user.registered-2
3	2025-07-15 22:47:48.589122	Auth User logout	{"id": 9, "email": "anna@gmail.com", "username": "Anna"}	9	2025-07-15T19:47:48.584Z	user.loggedout
4	2025-07-15 22:48:39.7031	New user login	{"id": 9, "email": "anna@gmail.com", "username": "Anna"}	9	2025-07-15T19:48:39.700Z	user.loggedin
5	2025-07-16 21:42:23.376855	Auth User logout	{"id": 9, "email": "anna@gmail.com", "username": "Anna"}	9	2025-07-16T18:42:23.363Z	user.loggedout
6	2025-07-16 21:42:42.360835	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-16T18:42:42.358Z	user.loggedin
7	2025-07-16 22:22:36.903532	Odin_allfather created a new post	{"id": 1, "text": "My first post in this app", "email": "odin@gmail.com", "title": "First Nail", "postId": 1, "username": "Odin_allfather", "createdAt": "2025-07-16T19:22:36.870Z"}	1	2025-07-16T19:22:36.897Z	post.created
8	2025-07-16 22:38:19.195758	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-16T19:38:19.189Z	user.loggedout
9	2025-07-16 22:38:55.8314	New user login	{"id": 5, "email": "thor@gmail.com", "username": "Thor oddisson"}	5	2025-07-16T19:38:55.829Z	user.loggedin
10	2025-07-17 20:19:55.107552	Auth User logout	{"id": 5, "email": "thor@gmail.com", "username": "Thor oddisson"}	5	2025-07-17T17:19:55.095Z	user.loggedout
11	2025-07-17 20:33:09.690678	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-17T17:33:09.683Z	user.loggedin
12	2025-07-17 20:33:39.324497	Odin_allfather created a new post	{"id": 1, "text": "The second post.......................mnqrneq", "email": "odin@gmail.com", "title": "Second Post", "postId": 2, "username": "Odin_allfather", "createdAt": "2025-07-17T17:33:39.289Z"}	1	2025-07-17T17:33:39.318Z	post.created
13	2025-07-17 20:38:21.494393	Odin_allfather created a new post	{"id": 1, "text": "23232", "email": "odin@gmail.com", "title": "332", "postId": 3, "username": "Odin_allfather", "createdAt": "2025-07-17T17:38:21.475Z"}	1	2025-07-17T17:38:21.492Z	post.created
14	2025-07-17 20:41:49.399889	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-17T17:41:49.395Z	user.loggedout
15	2025-07-17 20:42:10.411393	New user registration	{"id": 10, "email": "tonkata@gmail.com", "username": "Tonkata"}	10	2025-07-17T17:42:10.407Z	user.registered
16	2025-07-17 20:42:33.760812	Registration bonus	{"id": 10, "trigger": "user.registered", "username": "Tonkata", "pointsAdded": 10}	10	2025-07-17T17:42:33.754Z	user.bonus-awarded
17	2025-07-17 20:43:19.702766	Tonkata created a new post	{"id": 10, "text": "As a one two stwmdmfv...reerre", "email": "tonkata@gmail.com", "title": "My Loeve ", "postId": 4, "username": "Tonkata", "createdAt": "2025-07-17T17:43:19.667Z"}	10	2025-07-17T17:43:19.697Z	post.created
18	2025-07-17 20:44:29.702094	Tonkata created a new post	{"id": 10, "text": "234523523", "email": "tonkata@gmail.com", "title": "345352345", "postId": 5, "username": "Tonkata", "createdAt": "2025-07-17T17:44:29.630Z"}	10	2025-07-17T17:44:29.693Z	post.created
19	2025-07-17 20:44:39.695972	Post creation bonus	{"id": 10, "trigger": "post.created", "username": "Tonkata", "pointsAdded": 5}	10	2025-07-17T17:44:39.691Z	user.post-bonus
20	2025-07-18 21:44:30.034196	User Tonkata7 change some fields	{"id": 10, "email": "tonkata@gmail.com", "username": "Tonkata7"}	10	2025-07-18T18:44:30.032Z	user.updated
21	2025-07-19 14:25:41.604778	Post 345352345 was read	{"title": "345352345", "postId": 5}	10	2025-07-19T11:25:41.595Z	post.read
22	2025-07-19 14:26:04.621481	Post 345352345 was read	{"title": "345352345", "postId": 5}	10	2025-07-19T11:26:04.621Z	post.read
23	2025-07-19 14:26:20.693885	Tonkata7 deleted a post 345352345	{"id": 10, "text": "234523523", "email": "tonkata@gmail.com", "title": "345352345", "postId": 5, "username": "Tonkata7", "createdAt": "2025-07-17T17:44:29.630Z"}	10	2025-07-19T11:26:20.693Z	post.deleted
24	2025-07-19 14:26:26.737335	Post My Loeve  was read	{"title": "My Loeve ", "postId": 4}	10	2025-07-19T11:26:26.737Z	post.read
25	2025-07-19 14:28:32.252199	Post My Loeve  was read	{"title": "My Loeve ", "postId": 4}	10	2025-07-19T11:28:32.241Z	post.read
26	2025-07-19 14:29:38.894846	Post 332 was read	{"title": "332", "postId": 3}	10	2025-07-19T11:29:38.892Z	post.read
27	2025-07-19 14:35:48.912309	Post My Loeve  was read	{"title": "My Loeve ", "postId": 4}	10	2025-07-19T11:35:48.907Z	post.read
28	2025-07-19 14:35:51.964023	Tonkata7 deleted a post My Loeve 	{"id": 10, "text": "As a one two stwmdmfv...reerre", "email": "tonkata@gmail.com", "title": "My Loeve ", "postId": 4, "username": "Tonkata7", "createdAt": "2025-07-17T17:43:19.667Z"}	10	2025-07-19T11:35:51.963Z	post.deleted
29	2025-07-19 14:39:45.605275	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Tonkata7"}	10	2025-07-19T11:39:45.602Z	user.loggedout
30	2025-07-19 14:43:47.984643	New user login	{"id": 10, "email": "tonkata@gmail.com", "username": "Tonkata7"}	10	2025-07-19T11:43:47.984Z	user.loggedin
31	2025-07-19 14:44:34.684145	Tonkata7 created a new post	{"id": 10, "text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", "email": "tonkata@gmail.com", "title": "New Animal Post", "postId": 6, "username": "Tonkata7", "createdAt": "2025-07-19T11:44:34.647Z"}	10	2025-07-19T11:44:34.681Z	post.created
32	2025-07-19 14:44:35.110347	Post creation bonus	{"id": 10, "trigger": "post.created", "username": "Tonkata7", "pointsAdded": 5}	10	2025-07-19T11:44:35.096Z	user.post-bonus
33	2025-07-19 14:44:43.48855	Post New Animal Post was read	{"title": "New Animal Post", "postId": 6}	10	2025-07-19T11:44:43.487Z	post.read
34	2025-07-19 14:44:53.951268	Post 332 was read	{"title": "332", "postId": 3}	10	2025-07-19T11:44:53.951Z	post.read
35	2025-07-19 14:45:13.967258	User Toncho Dimitrov change some fields	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T11:45:13.967Z	user.updated
36	2025-07-19 14:48:42.802735	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T11:48:42.799Z	user.loggedout
37	2025-07-19 15:00:26.165199	New user login	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T12:00:26.163Z	user.loggedin
38	2025-07-19 15:17:39.79338	Post New Animal Post was read	{"title": "New Animal Post", "postId": 6}	10	2025-07-19T12:17:39.791Z	post.read
39	2025-07-19 15:22:21.555032	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T12:22:21.553Z	user.loggedout
40	2025-07-19 15:22:34.762585	Post New Animal Post was read	{"title": "New Animal Post", "postId": 6}	\N	2025-07-19T12:22:34.761Z	post.read
41	2025-07-19 15:26:10.327894	New user login	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T12:26:10.327Z	user.loggedin
42	2025-07-19 15:26:21.896775	Post New Animal Post was read	{"title": "New Animal Post", "postId": 6}	10	2025-07-19T12:26:21.895Z	post.read
43	2025-07-19 15:26:26.937572	Post 332 was read	{"title": "332", "postId": 3}	10	2025-07-19T12:26:26.934Z	post.read
44	2025-07-19 15:27:35.340567	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T12:27:35.340Z	user.loggedout
45	2025-07-19 15:48:00.854186	Post New Animal Post was read	{"title": "New Animal Post", "postId": 6}	\N	2025-07-19T12:48:00.853Z	post.read
46	2025-07-19 15:48:20.783189	New user login	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T12:48:20.782Z	user.loggedin
47	2025-07-19 19:31:11.793327	New user login	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T16:31:11.789Z	user.loggedin
48	2025-07-19 19:32:53.678544	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T16:32:53.676Z	user.loggedout
49	2025-07-19 20:33:26.108831	User change password	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T17:33:26.103Z	user.passwordchanged
50	2025-07-19 20:40:01.500703	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T17:40:01.498Z	user.loggedout
51	2025-07-19 20:40:19.079062	New user registration	{"id": 11, "email": "dimitar.i.dimitrov77@gmail.com", "username": "Diego de la vega-zorro"}	11	2025-07-19T17:40:19.077Z	user.registered
52	2025-07-19 20:40:35.324797	Registration bonus	{"id": 11, "trigger": "user.registered", "username": "Diego de la vega-zorro", "pointsAdded": 10}	11	2025-07-19T17:40:35.322Z	user.bonus-awarded
53	2025-07-19 20:40:35.392789	Auth User logout	{"id": 11, "email": "dimitar.i.dimitrov77@gmail.com", "username": "Diego de la vega-zorro"}	11	2025-07-19T17:40:35.390Z	user.loggedout
54	2025-07-19 21:41:21.970944	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T18:41:21.901Z	user.forgotpassword
55	2025-07-19 21:41:34.763211	User change password	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T18:41:34.761Z	user.passwordchanged
56	2025-07-19 22:20:02.462858	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T19:20:02.227Z	user.forgotpassword
57	2025-07-19 22:22:04.235844	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-19T19:22:04.229Z	user.forgotpassword
58	2025-07-20 16:58:20.025937	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T13:58:20.019Z	user.forgotpassword
59	2025-07-20 17:02:06.568593	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:02:06.564Z	user.forgotpassword
60	2025-07-20 17:05:46.910952	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:05:46.903Z	user.forgotpassword
61	2025-07-20 17:06:38.35132	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:06:38.347Z	user.forgotpassword
62	2025-07-20 17:09:59.391197	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:09:59.390Z	user.forgotpassword
63	2025-07-20 17:19:04.791504	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:19:04.777Z	user.forgotpassword
64	2025-07-20 17:23:41.896479	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:23:41.891Z	user.forgotpassword
65	2025-07-20 17:29:17.666964	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:29:17.663Z	user.forgotpassword
66	2025-07-20 17:31:27.654166	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:31:27.651Z	user.forgotpassword
67	2025-07-20 17:33:15.927161	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:33:15.923Z	user.forgotpassword
68	2025-07-20 17:35:18.992302	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:35:18.981Z	user.forgotpassword
69	2025-07-20 17:36:51.456509	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:36:51.452Z	user.forgotpassword
70	2025-07-20 17:43:12.575167	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:43:12.571Z	user.forgotpassword
71	2025-07-20 17:43:30.859471	User change password	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:43:30.858Z	user.passwordchanged
72	2025-07-20 17:49:46.036467	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:49:46.033Z	user.loggedout
73	2025-07-20 17:49:56.418969	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:49:56.417Z	user.forgotpassword
74	2025-07-20 17:57:35.005626	User forgot password and requested reset by email	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:57:35.000Z	user.forgotpassword
75	2025-07-20 17:57:52.628062	User change password	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:57:52.625Z	user.passwordchanged
76	2025-07-20 17:59:22.911746	Toncho Dimitrov created a new post	{"id": 10, "text": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).", "email": "tonkata@gmail.com", "title": "Post7", "postId": 7, "username": "Toncho Dimitrov", "createdAt": "2025-07-20T14:59:22.897Z"}	10	2025-07-20T14:59:22.910Z	post.created
77	2025-07-20 17:59:23.022265	Post creation bonus	{"id": 10, "trigger": "post.created", "username": "Toncho Dimitrov", "pointsAdded": 5}	10	2025-07-20T14:59:23.021Z	user.post-bonus
78	2025-07-20 17:59:35.543888	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-20T14:59:35.543Z	user.loggedout
79	2025-07-20 17:59:57.845233	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T14:59:57.844Z	user.loggedin
80	2025-07-20 18:00:19.806295	Odin_allfather created a new post	{"id": 1, "text": "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.", "email": "odin@gmail.com", "title": "Valhalla", "postId": 8, "username": "Odin_allfather", "createdAt": "2025-07-20T15:00:19.794Z"}	1	2025-07-20T15:00:19.802Z	post.created
81	2025-07-20 18:00:19.907841	Post creation bonus	{"id": 1, "trigger": "post.created", "username": "Odin_allfather", "pointsAdded": 5}	1	2025-07-20T15:00:19.906Z	user.post-bonus
82	2025-07-20 18:00:25.720108	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T15:00:25.719Z	user.loggedout
83	2025-07-20 18:04:17.713201	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T15:04:17.711Z	user.loggedin
84	2025-07-20 18:04:23.82162	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T15:04:23.820Z	user.loggedout
85	2025-07-20 18:10:42.583813	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T15:10:42.582Z	user.loggedin
86	2025-07-20 18:10:51.62484	User 1 voted on post 7	{"value": 1, "postId": 7, "userId": 1}	1	2025-07-20T15:10:51.572Z	user.voted
87	2025-07-20 18:10:58.609696	Post 332 was read	{"title": "332", "postId": 3}	1	2025-07-20T15:10:58.608Z	post.read
88	2025-07-20 18:11:31.931264	Odin_allfather updated a post Tale of Freya	{"id": 1, "text": "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \\"de Finibus Bonorum et Malorum\\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \\"Lorem ipsum dolor sit amet..\\", comes from a line in section 1.10.32.", "email": "odin@gmail.com", "title": "Tale of Freya", "postId": 3, "username": "Odin_allfather", "createdAt": "2025-07-17T17:38:21.475Z"}	1	2025-07-20T15:11:31.929Z	post.updated
89	2025-07-20 18:12:33.46974	Odin_allfather created a new post	{"id": 1, "text": "\\"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?\\"", "email": "odin@gmail.com", "title": "Mnuyya", "postId": 9, "username": "Odin_allfather", "createdAt": "2025-07-20T15:12:33.462Z"}	1	2025-07-20T15:12:33.468Z	post.created
90	2025-07-20 18:12:33.655028	Post creation bonus	{"id": 1, "trigger": "post.created", "username": "Odin_allfather", "pointsAdded": 5}	1	2025-07-20T15:12:33.654Z	user.post-bonus
106	2025-07-20 18:27:11.275092	Auth User logout	{"id": 5, "email": "thor@gmail.com", "username": "Thor Oddisson"}	5	2025-07-20T15:27:11.274Z	user.loggedout
107	2025-07-20 18:28:10.474548	New user registration	{"id": 12, "email": "joleyne@gmail.com", "username": "Joleyne matisson"}	12	2025-07-20T15:28:10.473Z	user.registered
91	2025-07-20 18:13:58.38952	Odin_allfather created a new post	{"id": 1, "text": "Artificial intelligence (AI) is a tool designed to mimic human processing and analytic skills to analyze problems, identify solutions, and decide on courses of action. Unlike traditional technology, artificial intelligence algorithms have the ability to adapt to new information and follow “thought processes” similar to those of a human brain. This type of algorithm can help professionals make informed and data-driven decisions.\\n\\n\\nProfessionals across a wide array of fields use artificial intelligence, with notable applications in finance, education, business, film, and health care. As we continue to expand our understanding of AI and its ability to assist humans in different contexts, the applications of AI are likely to grow steadily in the coming years.\\nIn finance, artificial intelligence is a powerful tool that helps financial firms decide who to lend money to. With AI algorithms, banks and other organizations can use the personal information of applicants to decide whether they have a high risk of defaulting on their loans. One of the benefits of AI in this context is that (theoretically) the algorithms make unbiased decisions. These AI algorithms can provide insights that bankers use to make investment and lending decisions depending on user inputs, such as risk preferences and outcome goals. \\n\\nAI also detects overall risk by finding trends and providing insights that can help organizations lower their risk threshold. ", "email": "odin@gmail.com", "title": "10 Artificial Intelligence Examples: AI in Practice", "postId": 10, "username": "Odin_allfather", "createdAt": "2025-07-20T15:13:58.380Z"}	1	2025-07-20T15:13:58.388Z	post.created
92	2025-07-20 18:13:58.532158	Post creation bonus	{"id": 1, "trigger": "post.created", "username": "Odin_allfather", "pointsAdded": 5}	1	2025-07-20T15:13:58.531Z	user.post-bonus
93	2025-07-20 18:14:05.453196	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T15:14:05.452Z	user.loggedout
94	2025-07-20 18:15:13.569995	New user login	{"id": 5, "email": "thor@gmail.com", "username": "Thor oddisson"}	5	2025-07-20T15:15:13.567Z	user.loggedin
95	2025-07-20 18:15:24.627552	User Thor Oddisson change some fields	{"id": 5, "email": "thor@gmail.com", "username": "Thor Oddisson"}	5	2025-07-20T15:15:24.626Z	user.updated
96	2025-07-20 18:17:19.21829	Thor Oddisson created a new post	{"id": 5, "text": "Baldr (also Balder, Baldur or Baldor) is the god of light and radiance, joy and purity, peace and forgiveness in Norse mythology. A member of the Æsir, he is the son of Odin and Frigg, and twin brother to the blind god of darkness, Höðr. His wife is called Nanna, with whom he had a son named Forseti, god of justice. Prior to his death, Baldr possessed a ship called Hringhorni, said to be the largest ship ever built. His hall is called Breidablik. Based on the Merseburg charms, one of his German names may have been Phol.\\nBaldr once had a nightmare that he would be killed. His mother, Frigg, made all the things across the Nine Realms vow not to hurt him. The mistletoe did not vow, however, as Frigg considered it to be so unimportant that she thought nothing of it. Loki found out that the mistletoe had not vowed, and thus made a spear out of the dreaded plant, and tricked Höðr into throwing it at Baldr. Beings from all across the Nine Realms will come to attend his funeral, and Baldr's wife Nanna soon dies of grief. Loki is soon caught and sentenced to punishment; he is bound by the entrails of one of his sons, to face torture as the venom of a massive serpent drips from its fangs onto Loki's eyes. This causes him unimaginable pain, writhing in agony. (The goddess Skaði is responsible for placing the serpent above him). His wife Sigyn is stationed nearby, collecting the drips of venom into a bowl. When the bowl is full, she leaves to empty it, and when she does, the venom drips onto the trickster and gradually eats away at his flesh. Loki's escape from this predicament is the catalyst of Ragnarök, as upon his being freed, he will lead the forces of Jötunheimr and Svartálfheimr in a final assault against the gods. \\n\\nDuring Ragnarök, the veils/barriers between the realms will be broken, so Baldr will be able to escape from Helheimr. After the death of Odin at the fangs of the monstrous wolf Fenrir, Baldr and Höðr came back to life, meeting with the other survivors in the fields of Iðavöllr (Old Norse: Iðavǫllr - \\"splendour-plain\\"), where Asgard once lay. There, they shall rule in place of their father.Baldr once had a nightmare that he would be killed. His mother, Frigg, made all the things across the Nine Realms vow not to hurt him. The mistletoe did not vow, however, as Frigg considered it to be so unimportant that she thought nothing of it. Loki found out that the mistletoe had not vowed, and thus made a spear out of the dreaded plant, and tricked Höðr into throwing it at Baldr. Beings from all across the Nine Realms will come to attend his funeral, and Baldr's wife Nanna soon dies of grief. Loki is soon caught and sentenced to punishment; he is bound by the entrails of one of his sons, to face torture as the venom of a massive serpent drips from its fangs onto Loki's eyes. This causes him unimaginable pain, writhing in agony. (The goddess Skaði is responsible for placing the serpent above him). His wife Sigyn is stationed nearby, collecting the drips of venom into a bowl. When the bowl is full, she leaves to empty it, and when she does, the venom drips onto the trickster and gradually eats away at his flesh. Loki's escape from this predicament is the catalyst of Ragnarök, as upon his being freed, he will lead the forces of Jötunheimr and Svartálfheimr in a final assault against the gods. \\n\\nDuring Ragnarök, the veils/barriers between the realms will be broken, so Baldr will be able to escape from Helheimr. After the death of Odin at the fangs of the monstrous wolf Fenrir, Baldr and Höðr came back to life, meeting with the other survivors in the fields of Iðavöllr (Old Norse: Iðavǫllr - \\"splendour-plain\\"), where Asgard once lay. There, they shall rule in place of their father.", "email": "thor@gmail.com", "title": "For my brother: Baldur", "postId": 11, "username": "Thor Oddisson", "createdAt": "2025-07-20T15:17:19.208Z"}	5	2025-07-20T15:17:19.217Z	post.created
97	2025-07-20 18:17:19.304362	Post creation bonus	{"id": 5, "trigger": "post.created", "username": "Thor Oddisson", "pointsAdded": 5}	5	2025-07-20T15:17:19.302Z	user.post-bonus
98	2025-07-20 18:17:37.249786	User 5 voted on post 8	{"value": 1, "postId": 8, "userId": 5}	5	2025-07-20T15:17:37.201Z	user.voted
99	2025-07-20 18:17:40.957918	User 5 voted on post 7	{"value": 1, "postId": 7, "userId": 5}	5	2025-07-20T15:17:40.956Z	user.voted
100	2025-07-20 18:17:43.05615	User 5 voted on post 3	{"value": 1, "postId": 3, "userId": 5}	5	2025-07-20T15:17:43.055Z	user.voted
101	2025-07-20 18:17:45.527101	User 5 voted on post 2	{"value": 1, "postId": 2, "userId": 5}	5	2025-07-20T15:17:45.526Z	user.voted
102	2025-07-20 18:18:38.036186	Thor Oddisson created a new post	{"id": 5, "text": "Stability: 1 - Experimental. The feature is not subject to semantic versioning rules. Non-backward compatible changes or removal may occur in any future release. Use of the feature is not recommended in production environments.\\nExperimental features are subdivided into stages:\\n\\n1.0 - Early development. Experimental features at this stage are unfinished and subject to substantial change.\\n1.1 - Active development. Experimental features at this stage are nearing minimum viability.\\n1.2 - Release candidate. Experimental features at this stage are hopefully ready to become stable. No further breaking changes are anticipated but may still occur in response to user feedback. We encourage user testing and feedback so that we can know that this feature is ready to be marked as stable.\\nExperimental features leave the experimental status typically either by graduating to stable, or are removed without a deprecation cycle.\\n\\nStability: 2 - Stable. Compatibility with the npm ecosystem is a high priority.\\nStability: 3 - Legacy. Although this feature is unlikely to be removed and is still covered by semantic versioning guarantees, it is no longer actively maintained, and other alternatives are available.\\nFeatures are marked as legacy rather than being deprecated if their use does no harm, and they are widely relied upon within the npm ecosystem. Bugs found in legacy features are unlikely to be fixed.\\n\\nUse caution when making use of Experimental features, particularly when authoring libraries. Users may not be aware that experimental features are being used. Bugs or behavior changes may surprise users when Experimental API modifications occur. To avoid surprises, use of an Experimental feature may need a command-line flag. Experimental features may also emit a warning.", "email": "thor@gmail.com", "title": "Node.js v24.4.1 documentation", "postId": 12, "username": "Thor Oddisson", "createdAt": "2025-07-20T15:18:38.027Z"}	5	2025-07-20T15:18:38.035Z	post.created
103	2025-07-20 18:18:38.137979	Post creation bonus	{"id": 5, "trigger": "post.created", "username": "Thor Oddisson", "pointsAdded": 5}	5	2025-07-20T15:18:38.135Z	user.post-bonus
104	2025-07-20 18:19:58.677488	Thor Oddisson created a new post	{"id": 5, "text": "Check back later\\nWe are unable to onboard you at this time. Don't worry! You've done everything you're supposed to, but we don't have any work available just yet. Check back later or take additional assessments while you wait.", "email": "thor@gmail.com", "title": "Checker", "postId": 13, "username": "Thor Oddisson", "createdAt": "2025-07-20T15:19:58.672Z"}	5	2025-07-20T15:19:58.676Z	post.created
105	2025-07-20 18:19:58.75754	Post creation bonus	{"id": 5, "trigger": "post.created", "username": "Thor Oddisson", "pointsAdded": 5}	5	2025-07-20T15:19:58.756Z	user.post-bonus
108	2025-07-20 18:28:10.505954	Registration bonus	{"id": 12, "trigger": "user.registered", "username": "Joleyne matisson", "pointsAdded": 10}	12	2025-07-20T15:28:10.504Z	user.bonus-awarded
109	2025-07-20 18:28:42.234186	Post For my brother: Baldur was read	{"title": "For my brother: Baldur", "postId": 11}	12	2025-07-20T15:28:42.233Z	post.read
110	2025-07-20 18:30:51.285899	Joleyne matisson created a new post	{"id": 12, "text": "Music has long been recognized not just as entertainment, but as a form of healing. From ancient tribal drums used in rituals to modern-day music therapy sessions, the emotional and physical benefits of music are profound. Studies show that listening to music can reduce cortisol levels, slow the heart rate, and even improve recovery after surgery. Whether it's classical symphonies calming the mind or upbeat pop music energizing the soul, music connects to our nervous system in a unique way. For many, playing an instrument or singing becomes a therapeutic outlet—one that allows expression when words fall short. In a world filled with constant stress, music remains a powerful, accessible tool for emotional release and mental clarity.", "email": "joleyne@gmail.com", "title": "The Healing Power of Music", "postId": 14, "username": "Joleyne matisson", "createdAt": "2025-07-20T15:30:51.278Z"}	12	2025-07-20T15:30:51.284Z	post.created
111	2025-07-20 18:30:51.377801	Post creation bonus	{"id": 12, "trigger": "post.created", "username": "Joleyne matisson", "pointsAdded": 5}	12	2025-07-20T15:30:51.376Z	user.post-bonus
112	2025-07-20 18:30:54.459333	Post The Healing Power of Music was read	{"title": "The Healing Power of Music", "postId": 14}	12	2025-07-20T15:30:54.458Z	post.read
113	2025-07-20 18:32:01.347299	Post The Healing Power of Music was read	{"title": "The Healing Power of Music", "postId": 14}	12	2025-07-20T15:32:01.345Z	post.read
114	2025-07-20 18:32:37.592395	Post The Healing Power of Music was read	{"title": "The Healing Power of Music", "postId": 14}	12	2025-07-20T15:32:37.591Z	post.read
115	2025-07-20 18:33:54.187322	Joleyne matisson created a new post	{"id": 12, "text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "email": "joleyne@gmail.com", "title": "How Music Shapes Culture", "postId": 15, "username": "Joleyne matisson", "createdAt": "2025-07-20T15:33:54.176Z"}	12	2025-07-20T15:33:54.186Z	post.created
116	2025-07-20 18:33:54.292384	Post creation bonus	{"id": 12, "trigger": "post.created", "username": "Joleyne matisson", "pointsAdded": 5}	12	2025-07-20T15:33:54.291Z	user.post-bonus
117	2025-07-20 18:34:43.831822	Auth User logout	{"id": 12, "email": "joleyne@gmail.com", "username": "Joleyne matisson"}	12	2025-07-20T15:34:43.830Z	user.loggedout
118	2025-07-20 23:03:55.903665	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T20:03:55.897Z	user.loggedin
119	2025-07-20 23:10:21.5075	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T20:10:21.505Z	user.loggedout
120	2025-07-20 23:11:42.237523	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T20:11:42.235Z	user.loggedin
121	2025-07-20 23:12:12.07748	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T20:12:12.075Z	user.loggedout
122	2025-07-20 23:12:30.420449	User forgot password and requested reset by email	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T20:12:30.417Z	user.forgotpassword
123	2025-07-20 23:13:12.777411	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-20T20:13:12.774Z	user.loggedin
124	2025-07-20 23:13:30.474768	Post How Music Shapes Culture was read	{"title": "How Music Shapes Culture", "postId": 15}	1	2025-07-20T20:13:30.472Z	post.read
125	2025-07-21 06:47:03.321587	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-21T03:47:03.269Z	user.loggedout
126	2025-07-21 06:47:26.692253	Post How Music Shapes Culture was read	{"title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-21T03:47:26.690Z	post.read
127	2025-07-21 06:47:53.684125	Post How Music Shapes Culture was read	{"title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-21T03:47:53.678Z	post.read
128	2025-07-21 06:48:04.380509	Post The Healing Power of Music was read	{"title": "The Healing Power of Music", "postId": 14}	\N	2025-07-21T03:48:04.378Z	post.read
129	2025-07-21 06:49:03.793337	Post The Healing Power of Music was read	{"title": "The Healing Power of Music", "postId": 14}	\N	2025-07-21T03:49:03.775Z	post.read
130	2025-07-21 07:01:21.307988	Post The Healing Power of Music was read	{"title": "The Healing Power of Music", "postId": 14}	\N	2025-07-21T04:01:21.311Z	post.read
131	2025-07-21 19:46:03.374022	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-21T16:46:03.368Z	user.loggedin
132	2025-07-21 19:46:25.400137	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-21T16:46:25.397Z	user.loggedout
133	2025-07-21 19:46:36.054929	New user login	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-21T16:46:36.052Z	user.loggedin
134	2025-07-21 20:06:43.744001	Post How Music Shapes Culture was read	{"title": "How Music Shapes Culture", "postId": 15}	10	2025-07-21T17:06:43.735Z	post.read
135	2025-07-21 20:06:49.491236	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:06:49.489Z	user.voted
136	2025-07-21 20:06:51.426401	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:06:51.424Z	user.voted
137	2025-07-21 20:06:52.966405	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:06:52.964Z	user.voted
138	2025-07-21 20:06:54.382612	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:06:54.380Z	user.voted
139	2025-07-21 20:06:55.4118	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:06:55.409Z	user.voted
140	2025-07-21 20:06:57.259413	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:06:57.257Z	user.voted
141	2025-07-21 20:06:58.634046	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:06:58.632Z	user.voted
142	2025-07-21 20:07:00.284235	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:00.282Z	user.voted
143	2025-07-21 20:07:01.564688	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:01.562Z	user.voted
144	2025-07-21 20:07:03.26279	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:03.261Z	user.voted
145	2025-07-21 20:07:11.038008	Post How Music Shapes Culture was read	{"title": "How Music Shapes Culture", "postId": 15}	10	2025-07-21T17:07:11.034Z	post.read
146	2025-07-21 20:07:14.134971	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:14.133Z	user.voted
147	2025-07-21 20:07:15.241299	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:15.239Z	user.voted
148	2025-07-21 20:07:15.957361	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:15.954Z	user.voted
149	2025-07-21 20:07:17.011829	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:17.010Z	user.voted
150	2025-07-21 20:07:17.217735	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:17.215Z	user.voted
151	2025-07-21 20:07:17.771834	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:17.770Z	user.voted
152	2025-07-21 20:07:42.869107	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:42.867Z	user.voted
153	2025-07-21 20:07:44.016411	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:44.014Z	user.voted
154	2025-07-21 20:07:47.863257	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:47.861Z	user.voted
155	2025-07-21 20:07:49.214219	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:49.212Z	user.voted
156	2025-07-21 20:07:50.56975	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:50.568Z	user.voted
157	2025-07-21 20:07:51.705204	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:07:51.703Z	user.voted
158	2025-07-21 20:07:53.848101	User 10 voted on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:07:53.846Z	user.voted
159	2025-07-21 20:07:55.561685	User 10 voted on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:07:55.560Z	user.voted
160	2025-07-21 20:08:28.461571	User 10 voted on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:08:28.291Z	user.voted
161	2025-07-21 20:08:29.876442	User 10 voted on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:08:29.874Z	user.voted
162	2025-07-21 20:08:46.655023	Post How Music Shapes Culture was read	{"title": "How Music Shapes Culture", "postId": 15}	10	2025-07-21T17:08:46.653Z	post.read
163	2025-07-21 20:08:48.222383	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:08:48.220Z	user.voted
164	2025-07-21 20:08:50.247425	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:08:50.246Z	user.voted
165	2025-07-21 20:08:52.075173	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:08:52.074Z	user.voted
166	2025-07-21 20:08:53.049746	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:08:53.032Z	user.voted
167	2025-07-21 20:08:54.331531	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:08:54.330Z	user.voted
168	2025-07-21 20:08:55.531818	User 10 voted on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:08:55.530Z	user.voted
169	2025-07-21 20:08:56.931314	User 10 voted on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:08:56.929Z	user.voted
170	2025-07-21 20:09:02.329969	User 10 voted on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:09:02.328Z	user.voted
171	2025-07-21 20:09:03.685967	User 10 voted on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:09:03.684Z	user.voted
172	2025-07-21 20:09:05.307682	User 10 voted on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:09:05.306Z	user.voted
173	2025-07-21 20:09:06.736281	User 10 voted on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:09:06.734Z	user.voted
174	2025-07-21 20:17:08.351783	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:08.347Z	user.voted
175	2025-07-21 20:17:10.378161	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:10.376Z	user.voted
176	2025-07-21 20:17:11.068801	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:11.067Z	user.voted
177	2025-07-21 20:17:11.926616	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:11.924Z	user.voted
178	2025-07-21 20:17:16.97264	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:16.971Z	user.voted
179	2025-07-21 20:17:17.16493	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:17.163Z	user.voted
180	2025-07-21 20:17:18.829575	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:18.828Z	user.voted
181	2025-07-21 20:17:28.656824	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:28.656Z	user.voted
182	2025-07-21 20:17:29.76027	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:29.758Z	user.voted
183	2025-07-21 20:17:30.616687	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:30.615Z	user.voted
184	2025-07-21 20:17:44.052427	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:17:44.051Z	user.voted
185	2025-07-21 20:17:46.321692	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:17:46.320Z	user.voted
186	2025-07-21 20:17:47.411234	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:17:47.410Z	user.voted
187	2025-07-21 20:17:48.616163	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:17:48.615Z	user.voted
188	2025-07-21 20:17:49.102961	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:17:49.101Z	user.voted
189	2025-07-21 20:17:49.613093	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:17:49.612Z	user.voted
190	2025-07-21 20:17:49.844199	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:17:49.843Z	user.voted
191	2025-07-21 20:17:50.067668	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:17:50.066Z	user.voted
192	2025-07-21 20:17:50.253255	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:17:50.252Z	user.voted
193	2025-07-21 20:21:00.923198	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:21:00.921Z	user.voted
194	2025-07-21 20:21:02.143063	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:21:02.141Z	user.voted
195	2025-07-21 20:21:06.143613	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:21:06.142Z	user.voted
196	2025-07-21 20:21:06.815759	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:21:06.813Z	user.voted
197	2025-07-21 20:21:07.390405	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:21:07.389Z	user.voted
198	2025-07-21 20:21:15.079302	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:15.077Z	user.voted
199	2025-07-21 20:21:16.226415	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:16.224Z	user.voted
200	2025-07-21 20:21:17.769989	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:17.768Z	user.voted
201	2025-07-21 20:21:18.527783	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:18.526Z	user.voted
202	2025-07-21 20:21:19.693425	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:19.692Z	user.voted
203	2025-07-21 20:21:20.705149	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:20.704Z	user.voted
204	2025-07-21 20:21:21.453938	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:21.453Z	user.voted
205	2025-07-21 20:21:23.84131	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:23.840Z	user.voted
206	2025-07-21 20:21:24.840189	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:24.839Z	user.voted
207	2025-07-21 20:21:28.798441	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:28.796Z	user.voted
208	2025-07-21 20:21:33.235603	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:33.234Z	user.voted
209	2025-07-21 20:21:36.742835	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:36.741Z	user.voted
210	2025-07-21 20:21:38.767234	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:38.766Z	user.voted
211	2025-07-21 20:21:40.693721	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:40.692Z	user.voted
212	2025-07-21 20:21:41.58207	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:41.581Z	user.voted
213	2025-07-21 20:21:43.851654	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:43.850Z	user.voted
214	2025-07-21 20:21:45.797077	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:45.795Z	user.voted
215	2025-07-21 20:21:47.087282	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:21:47.086Z	user.voted
216	2025-07-21 20:21:54.88003	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:54.878Z	user.voted
217	2025-07-21 20:21:56.272152	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:56.270Z	user.voted
218	2025-07-21 20:21:58.035176	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:58.034Z	user.voted
219	2025-07-21 20:21:59.296496	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:21:59.295Z	user.voted
220	2025-07-21 20:23:10.099351	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:10.098Z	user.voted
221	2025-07-21 20:23:11.266972	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:11.266Z	user.voted
222	2025-07-21 20:23:12.053272	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:12.052Z	user.voted
223	2025-07-21 20:23:13.228899	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:13.227Z	user.voted
224	2025-07-21 20:23:14.005627	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:14.004Z	user.voted
225	2025-07-21 20:23:15.120485	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:15.119Z	user.voted
226	2025-07-21 20:23:16.187286	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:16.186Z	user.voted
227	2025-07-21 20:23:17.154941	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:17.154Z	user.voted
228	2025-07-21 20:23:18.359178	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:18.357Z	user.voted
229	2025-07-21 20:23:19.570331	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:19.569Z	user.voted
230	2025-07-21 20:23:22.01384	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:22.012Z	user.voted
231	2025-07-21 20:23:23.681537	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:23:23.680Z	user.voted
232	2025-07-21 20:23:25.489843	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:25.488Z	user.voted
233	2025-07-21 20:23:26.471187	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:26.470Z	user.voted
234	2025-07-21 20:23:27.269575	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:27.268Z	user.voted
235	2025-07-21 20:23:28.219874	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:28.218Z	user.voted
236	2025-07-21 20:23:29.097298	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:29.096Z	user.voted
237	2025-07-21 20:23:53.75384	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:53.752Z	user.voted
238	2025-07-21 20:23:56.061642	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:56.060Z	user.voted
239	2025-07-21 20:23:57.108597	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:57.107Z	user.voted
240	2025-07-21 20:23:57.660811	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:57.659Z	user.voted
241	2025-07-21 20:23:58.621392	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:58.620Z	user.voted
242	2025-07-21 20:23:59.546445	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:23:59.545Z	user.voted
243	2025-07-21 20:24:00.231786	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:00.230Z	user.voted
244	2025-07-21 20:24:01.598984	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:01.597Z	user.voted
245	2025-07-21 20:24:02.663396	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:02.662Z	user.voted
246	2025-07-21 20:24:03.769229	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:03.768Z	user.voted
247	2025-07-21 20:24:04.438074	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:04.437Z	user.voted
248	2025-07-21 20:24:05.110512	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:05.109Z	user.voted
249	2025-07-21 20:24:06.45702	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:06.456Z	user.voted
250	2025-07-21 20:24:06.88041	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:06.879Z	user.voted
251	2025-07-21 20:24:09.256438	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:09.255Z	user.voted
252	2025-07-21 20:24:09.99169	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:09.991Z	user.voted
253	2025-07-21 20:24:11.267599	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:11.266Z	user.voted
254	2025-07-21 20:24:11.802292	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:11.801Z	user.voted
255	2025-07-21 20:24:12.584813	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:12.583Z	user.voted
256	2025-07-21 20:24:13.708462	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:13.707Z	user.voted
257	2025-07-21 20:24:14.193403	User 10 voted -1 on post 13	{"value": -1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:14.192Z	user.voted
258	2025-07-21 20:24:15.18246	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:15.181Z	user.voted
259	2025-07-21 20:24:16.661084	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:16.660Z	user.voted
260	2025-07-21 20:24:17.974571	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:17.973Z	user.voted
261	2025-07-21 20:24:18.952533	User 10 voted 1 on post 13	{"value": 1, "postId": 13, "userId": 10}	10	2025-07-21T17:24:18.951Z	user.voted
262	2025-07-21 20:24:20.299732	User 10 voted 1 on post 12	{"value": 1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:20.298Z	user.voted
263	2025-07-21 20:24:20.978531	User 10 voted 1 on post 12	{"value": 1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:20.977Z	user.voted
264	2025-07-21 20:24:22.063168	User 10 voted -1 on post 12	{"value": -1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:22.062Z	user.voted
265	2025-07-21 20:24:22.424201	User 10 voted -1 on post 12	{"value": -1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:22.423Z	user.voted
266	2025-07-21 20:24:23.362837	User 10 voted 1 on post 12	{"value": 1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:23.362Z	user.voted
267	2025-07-21 20:24:23.651069	User 10 voted 1 on post 12	{"value": 1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:23.650Z	user.voted
268	2025-07-21 20:24:25.109697	User 10 voted -1 on post 12	{"value": -1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:25.108Z	user.voted
269	2025-07-21 20:24:39.302886	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:24:39.301Z	user.voted
270	2025-07-21 20:24:40.588461	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:40.587Z	user.voted
271	2025-07-21 20:24:44.248001	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:44.247Z	user.voted
272	2025-07-21 20:24:45.409958	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:45.409Z	user.voted
273	2025-07-21 20:24:46.355643	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:46.354Z	user.voted
274	2025-07-21 20:24:47.254716	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:47.253Z	user.voted
275	2025-07-21 20:24:47.94778	User 10 voted -1 on post 14	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:47.947Z	user.voted
276	2025-07-21 20:24:48.734431	User 10 voted 1 on post 14	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:24:48.733Z	user.voted
277	2025-07-21 20:24:51.787712	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:24:51.786Z	user.voted
278	2025-07-21 20:24:52.713112	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:24:52.711Z	user.voted
279	2025-07-21 20:24:53.67048	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:24:53.669Z	user.voted
280	2025-07-21 20:24:56.80777	User 10 voted 1 on post 12	{"value": 1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:56.806Z	user.voted
281	2025-07-21 20:24:58.477901	User 10 voted 1 on post 12	{"value": 1, "postId": 12, "userId": 10}	10	2025-07-21T17:24:58.477Z	user.voted
282	2025-07-21 20:25:00.773769	User 10 voted -1 on post 11	{"value": -1, "postId": 11, "userId": 10}	10	2025-07-21T17:25:00.772Z	user.voted
283	2025-07-21 20:25:02.154962	User 10 voted 1 on post 11	{"value": 1, "postId": 11, "userId": 10}	10	2025-07-21T17:25:02.154Z	user.voted
284	2025-07-21 20:25:03.200367	User 10 voted 1 on post 11	{"value": 1, "postId": 11, "userId": 10}	10	2025-07-21T17:25:03.199Z	user.voted
285	2025-07-21 20:25:05.348942	User 10 voted 1 on post 10	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:25:05.348Z	user.voted
286	2025-07-21 20:25:06.320809	User 10 voted -1 on post 10	{"value": -1, "postId": 10, "userId": 10}	10	2025-07-21T17:25:06.320Z	user.voted
287	2025-07-21 20:25:07.754803	User 10 voted 1 on post 10	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:25:07.754Z	user.voted
288	2025-07-21 20:25:15.20901	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:15.207Z	user.voted
289	2025-07-21 20:25:16.556324	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:16.555Z	user.voted
290	2025-07-21 20:25:17.909032	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:17.908Z	user.voted
291	2025-07-21 20:25:20.341398	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:20.340Z	user.voted
292	2025-07-21 20:25:21.450301	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:21.448Z	user.voted
293	2025-07-21 20:25:23.257476	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:23.256Z	user.voted
294	2025-07-21 20:25:24.3476	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:24.346Z	user.voted
295	2025-07-21 20:25:25.881807	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:25.880Z	user.voted
296	2025-07-21 20:25:27.204914	User 10 voted -1 on post 15	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:27.203Z	user.voted
297	2025-07-21 20:25:30.544093	User 10 voted 1 on post 15	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:25:30.543Z	user.voted
298	2025-07-21 20:33:21.058566	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:21.054Z	user.voted
299	2025-07-21 20:33:22.254937	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:22.253Z	user.voted
300	2025-07-21 20:33:23.177482	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:23.176Z	user.voted
301	2025-07-21 20:33:23.60438	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:23.603Z	user.voted
302	2025-07-21 20:33:25.074893	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:25.074Z	user.voted
303	2025-07-21 20:33:26.48674	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:26.485Z	user.voted
304	2025-07-21 20:33:27.250863	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:27.249Z	user.voted
305	2025-07-21 20:33:28.259496	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:28.258Z	user.voted
306	2025-07-21 20:33:29.689202	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:29.688Z	user.voted
307	2025-07-21 20:33:31.063579	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:31.062Z	user.voted
308	2025-07-21 20:33:32.067067	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:32.066Z	user.voted
309	2025-07-21 20:33:32.957457	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:32.956Z	user.voted
310	2025-07-21 20:33:34.803325	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:34.802Z	user.voted
311	2025-07-21 20:33:35.50305	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:35.502Z	user.voted
312	2025-07-21 20:33:36.595044	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:36.594Z	user.voted
313	2025-07-21 20:33:36.838076	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:33:36.837Z	user.voted
314	2025-07-21 20:34:03.615702	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:03.614Z	user.voted
315	2025-07-21 20:34:04.819284	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:04.818Z	user.voted
316	2025-07-21 20:34:05.695049	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:05.694Z	user.voted
317	2025-07-21 20:34:07.063852	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:07.063Z	user.voted
318	2025-07-21 20:34:08.280808	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:08.280Z	user.voted
319	2025-07-21 20:34:08.777069	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:08.776Z	user.voted
320	2025-07-21 20:34:10.197174	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:10.196Z	user.voted
321	2025-07-21 20:34:12.052507	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:12.051Z	user.voted
322	2025-07-21 20:34:13.027254	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:13.026Z	user.voted
323	2025-07-21 20:34:14.106827	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:14.105Z	user.voted
324	2025-07-21 20:34:14.677177	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:14.676Z	user.voted
325	2025-07-21 20:34:15.520301	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:15.519Z	user.voted
326	2025-07-21 20:34:16.19728	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:16.196Z	user.voted
327	2025-07-21 20:34:16.969008	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:16.968Z	user.voted
328	2025-07-21 20:34:17.671475	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:17.670Z	user.voted
329	2025-07-21 20:34:18.359845	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:18.359Z	user.voted
330	2025-07-21 20:34:19.495935	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:19.495Z	user.voted
331	2025-07-21 20:34:20.200271	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:20.199Z	user.voted
332	2025-07-21 20:34:21.294008	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:21.293Z	user.voted
333	2025-07-21 20:34:22.393062	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:22.392Z	user.voted
334	2025-07-21 20:34:24.473315	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:24.472Z	user.voted
335	2025-07-21 20:34:25.520846	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:25.520Z	user.voted
336	2025-07-21 20:34:26.403294	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:34:26.402Z	user.voted
337	2025-07-21 20:34:38.667281	User Toncho Dimitrov voted -1 on post The Healing Power of Music	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:34:38.625Z	user.voted
338	2025-07-21 20:34:40.448917	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:34:40.448Z	user.voted
339	2025-07-21 20:34:41.856015	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:34:41.854Z	user.voted
340	2025-07-21 20:34:43.32394	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:34:43.323Z	user.voted
341	2025-07-21 20:34:44.518236	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:34:44.517Z	user.voted
342	2025-07-21 20:35:56.965371	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:35:56.913Z	user.voted
343	2025-07-21 20:35:58.022635	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:35:58.021Z	user.voted
344	2025-07-21 20:35:59.224928	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:35:59.223Z	user.voted
345	2025-07-21 20:35:59.790491	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:35:59.788Z	user.voted
346	2025-07-21 20:36:00.646725	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:36:00.645Z	user.voted
347	2025-07-21 20:36:01.198696	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:36:01.196Z	user.voted
348	2025-07-21 20:37:24.27718	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:24.275Z	user.voted
349	2025-07-21 20:37:25.259169	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:25.257Z	user.voted
350	2025-07-21 20:37:26.97837	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:26.976Z	user.voted
351	2025-07-21 20:37:27.806841	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:27.804Z	user.voted
352	2025-07-21 20:37:28.552943	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:28.551Z	user.voted
353	2025-07-21 20:37:29.847291	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:29.845Z	user.voted
354	2025-07-21 20:37:30.939613	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:30.938Z	user.voted
355	2025-07-21 20:37:31.625318	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:31.623Z	user.voted
356	2025-07-21 20:37:32.660102	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:32.658Z	user.voted
357	2025-07-21 20:37:33.078299	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:33.076Z	user.voted
358	2025-07-21 20:37:34.289245	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:34.287Z	user.voted
359	2025-07-21 20:37:35.815923	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:35.814Z	user.voted
360	2025-07-21 20:37:37.689348	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:37.687Z	user.voted
361	2025-07-21 20:37:38.537429	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:38.535Z	user.voted
362	2025-07-21 20:37:39.24227	User Toncho Dimitrov voted 1 on post How Music Shapes Culture	{"value": 1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:39.241Z	user.voted
363	2025-07-21 20:37:40.085517	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:40.083Z	user.voted
364	2025-07-21 20:37:40.74794	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:40.746Z	user.voted
365	2025-07-21 20:37:41.440536	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:41.438Z	user.voted
366	2025-07-21 20:37:41.843554	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:41.842Z	user.voted
367	2025-07-21 20:37:42.029839	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:42.028Z	user.voted
368	2025-07-21 20:37:42.224753	User Toncho Dimitrov voted -1 on post How Music Shapes Culture	{"value": -1, "postId": 15, "userId": 10}	10	2025-07-21T17:37:42.223Z	user.voted
369	2025-07-21 20:38:28.964372	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:38:28.963Z	user.voted
370	2025-07-21 20:38:30.284434	User Toncho Dimitrov voted -1 on post The Healing Power of Music	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:38:30.283Z	user.voted
371	2025-07-21 20:38:32.017655	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:38:32.016Z	user.voted
372	2025-07-21 20:38:33.981589	User Toncho Dimitrov voted -1 on post The Healing Power of Music	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:38:33.979Z	user.voted
373	2025-07-21 20:38:35.1696	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:38:35.168Z	user.voted
374	2025-07-21 20:38:36.560622	User Toncho Dimitrov voted -1 on post The Healing Power of Music	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:38:36.559Z	user.voted
375	2025-07-21 20:38:37.24525	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:38:37.243Z	user.voted
376	2025-07-21 20:38:38.00186	User Toncho Dimitrov voted -1 on post The Healing Power of Music	{"value": -1, "postId": 14, "userId": 10}	10	2025-07-21T17:38:38.000Z	user.voted
377	2025-07-21 20:40:37.986888	User Toncho Dimitrov voted 1 on post 10 Artificial Intelligence Examples: AI in Practice	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:40:37.985Z	user.voted
378	2025-07-21 20:40:39.705956	User Toncho Dimitrov voted -1 on post 10 Artificial Intelligence Examples: AI in Practice	{"value": -1, "postId": 10, "userId": 10}	10	2025-07-21T17:40:39.705Z	user.voted
379	2025-07-21 20:40:40.766566	User Toncho Dimitrov voted 1 on post 10 Artificial Intelligence Examples: AI in Practice	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:40:40.765Z	user.voted
380	2025-07-21 20:40:41.300354	User Toncho Dimitrov voted 1 on post 10 Artificial Intelligence Examples: AI in Practice	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:40:41.299Z	user.voted
381	2025-07-21 20:40:41.796523	User Toncho Dimitrov voted 1 on post 10 Artificial Intelligence Examples: AI in Practice	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:40:41.795Z	user.voted
382	2025-07-21 20:40:42.293036	User Toncho Dimitrov voted 1 on post 10 Artificial Intelligence Examples: AI in Practice	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:40:42.292Z	user.voted
383	2025-07-21 20:40:42.981769	User Toncho Dimitrov voted 1 on post 10 Artificial Intelligence Examples: AI in Practice	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:40:42.980Z	user.voted
384	2025-07-21 20:40:49.416132	User Toncho Dimitrov voted 1 on post The Healing Power of Music	{"value": 1, "postId": 14, "userId": 10}	10	2025-07-21T17:40:49.414Z	user.voted
385	2025-07-21 20:40:57.845116	User Toncho Dimitrov voted 1 on post 10 Artificial Intelligence Examples: AI in Practice	{"value": 1, "postId": 10, "userId": 10}	10	2025-07-21T17:40:57.843Z	user.voted
386	2025-07-21 20:41:25.386857	User Toncho Dimitrov voted -1 on post Valhalla	{"value": -1, "postId": 8, "userId": 10}	10	2025-07-21T17:41:25.384Z	user.voted
387	2025-07-21 20:41:28.013807	User Toncho Dimitrov voted 1 on post Post7	{"value": 1, "postId": 7, "userId": 10}	10	2025-07-21T17:41:28.012Z	user.voted
388	2025-07-21 20:56:59.229844	User Toncho Dimitrov change some fields	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-21T17:56:59.228Z	user.updated
389	2025-07-21 20:57:12.47613	Auth User logout	{"id": 10, "email": "tonkata@gmail.com", "username": "Toncho Dimitrov"}	10	2025-07-21T17:57:12.474Z	user.loggedout
390	2025-07-21 22:44:58.497499	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-21T19:44:58.488Z	post.read
391	2025-07-21 22:45:12.771342	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-21T19:45:12.766Z	user.loggedin
392	2025-07-22 06:18:34.061022	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-22T03:18:34.048Z	user.loggedout
393	2025-07-22 06:30:57.399609	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-22T03:30:57.397Z	user.loggedin
394	2025-07-22 06:31:53.854828	Auth User logout	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-22T03:31:53.853Z	user.loggedout
395	2025-07-22 06:37:54.180657	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-22T03:37:54.177Z	post.read
396	2025-07-22 06:38:15.568772	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-22T03:38:15.564Z	post.read
397	2025-07-22 06:38:21.000465	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-22T03:38:20.997Z	post.read
398	2025-07-22 06:38:43.23574	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-22T03:38:43.232Z	post.read
399	2025-07-22 06:39:00.788924	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-22T03:39:00.786Z	post.read
400	2025-07-22 06:39:29.480681	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-22T03:39:29.477Z	post.read
401	2025-07-22 06:40:01.56243	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-22T03:40:01.554Z	post.read
402	2025-07-22 07:08:07.756549	Post How Music Shapes Culture was read	{"text": "Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.", "title": "How Music Shapes Culture", "postId": 15}	\N	2025-07-22T04:08:07.754Z	post.read
403	2025-07-22 19:31:50.741945	New user login	{"id": 1, "email": "odin@gmail.com", "username": "Odin_allfather"}	1	2025-07-22T16:31:50.738Z	user.loggedin
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post (id, title, text, points, "creatorId", "createdAt", "updatedAt", "popularityPts") FROM stdin;
1	First Nail	My first post in this app	0	1	2025-07-16 22:22:36.870471	2025-07-16 22:22:36.870471	0
3	Tale of Freya	Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.	0	1	2025-07-17 20:38:21.475633	2025-07-20 18:17:43.04905	4
9	Mnuyya	"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"	0	1	2025-07-20 18:12:33.462041	2025-07-20 18:12:33.462041	0
2	Second Post	The second post.......................mnqrneq	0	1	2025-07-17 20:33:39.28954	2025-07-20 18:17:45.520662	0
13	Checker	Check back later\nWe are unable to onboard you at this time. Don't worry! You've done everything you're supposed to, but we don't have any work available just yet. Check back later or take additional assessments while you wait.	0	5	2025-07-20 18:19:58.672848	2025-07-21 20:24:18.946002	0
7	Post7	It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).	1	10	2025-07-20 17:59:22.897038	2025-07-21 20:41:27.999155	0
6	New Animal Post	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum	0	10	2025-07-19 14:44:34.647028	2025-07-19 15:48:00.850605	5
8	Valhalla	There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.	-1	1	2025-07-20 18:00:19.79422	2025-07-21 20:41:25.364932	0
15	How Music Shapes Culture	Music doesn’t just reflect culture—it shapes it. From protest anthems to viral pop hits, music has the power to influence fashion, language, and even politics. Consider the 1960s: artists like Bob Dylan and The Beatles didn’t just entertain—they inspired movements. Today, genres like hip-hop and reggaeton influence global trends across continents. Music spreads ideas faster than textbooks ever could. It can challenge norms, introduce new perspectives, or unite people under a shared rhythm. Cultural traditions are passed down through folk songs, lullabies, and anthems. As societies evolve, their music archives a history of values, struggles, and joys. In essence, music is a living artifact of who we are.	0	12	2025-07-20 18:33:54.1764	2025-07-22 07:08:07.751513	15
14	The Healing Power of Music	Music has long been recognized not just as entertainment, but as a form of healing. From ancient tribal drums used in rituals to modern-day music therapy sessions, the emotional and physical benefits of music are profound. Studies show that listening to music can reduce cortisol levels, slow the heart rate, and even improve recovery after surgery. Whether it's classical symphonies calming the mind or upbeat pop music energizing the soul, music connects to our nervous system in a unique way. For many, playing an instrument or singing becomes a therapeutic outlet—one that allows expression when words fall short. In a world filled with constant stress, music remains a powerful, accessible tool for emotional release and mental clarity.	1	12	2025-07-20 18:30:51.278971	2025-07-21 20:40:49.405633	6
12	Node.js v24.4.1 documentation	Stability: 1 - Experimental. The feature is not subject to semantic versioning rules. Non-backward compatible changes or removal may occur in any future release. Use of the feature is not recommended in production environments.\nExperimental features are subdivided into stages:\n\n1.0 - Early development. Experimental features at this stage are unfinished and subject to substantial change.\n1.1 - Active development. Experimental features at this stage are nearing minimum viability.\n1.2 - Release candidate. Experimental features at this stage are hopefully ready to become stable. No further breaking changes are anticipated but may still occur in response to user feedback. We encourage user testing and feedback so that we can know that this feature is ready to be marked as stable.\nExperimental features leave the experimental status typically either by graduating to stable, or are removed without a deprecation cycle.\n\nStability: 2 - Stable. Compatibility with the npm ecosystem is a high priority.\nStability: 3 - Legacy. Although this feature is unlikely to be removed and is still covered by semantic versioning guarantees, it is no longer actively maintained, and other alternatives are available.\nFeatures are marked as legacy rather than being deprecated if their use does no harm, and they are widely relied upon within the npm ecosystem. Bugs found in legacy features are unlikely to be fixed.\n\nUse caution when making use of Experimental features, particularly when authoring libraries. Users may not be aware that experimental features are being used. Bugs or behavior changes may surprise users when Experimental API modifications occur. To avoid surprises, use of an Experimental feature may need a command-line flag. Experimental features may also emit a warning.	0	5	2025-07-20 18:18:38.027222	2025-07-21 20:24:58.471833	0
11	For my brother: Baldur	Baldr (also Balder, Baldur or Baldor) is the god of light and radiance, joy and purity, peace and forgiveness in Norse mythology. A member of the Æsir, he is the son of Odin and Frigg, and twin brother to the blind god of darkness, Höðr. His wife is called Nanna, with whom he had a son named Forseti, god of justice. Prior to his death, Baldr possessed a ship called Hringhorni, said to be the largest ship ever built. His hall is called Breidablik. Based on the Merseburg charms, one of his German names may have been Phol.\nBaldr once had a nightmare that he would be killed. His mother, Frigg, made all the things across the Nine Realms vow not to hurt him. The mistletoe did not vow, however, as Frigg considered it to be so unimportant that she thought nothing of it. Loki found out that the mistletoe had not vowed, and thus made a spear out of the dreaded plant, and tricked Höðr into throwing it at Baldr. Beings from all across the Nine Realms will come to attend his funeral, and Baldr's wife Nanna soon dies of grief. Loki is soon caught and sentenced to punishment; he is bound by the entrails of one of his sons, to face torture as the venom of a massive serpent drips from its fangs onto Loki's eyes. This causes him unimaginable pain, writhing in agony. (The goddess Skaði is responsible for placing the serpent above him). His wife Sigyn is stationed nearby, collecting the drips of venom into a bowl. When the bowl is full, she leaves to empty it, and when she does, the venom drips onto the trickster and gradually eats away at his flesh. Loki's escape from this predicament is the catalyst of Ragnarök, as upon his being freed, he will lead the forces of Jötunheimr and Svartálfheimr in a final assault against the gods. \n\nDuring Ragnarök, the veils/barriers between the realms will be broken, so Baldr will be able to escape from Helheimr. After the death of Odin at the fangs of the monstrous wolf Fenrir, Baldr and Höðr came back to life, meeting with the other survivors in the fields of Iðavöllr (Old Norse: Iðavǫllr - "splendour-plain"), where Asgard once lay. There, they shall rule in place of their father.Baldr once had a nightmare that he would be killed. His mother, Frigg, made all the things across the Nine Realms vow not to hurt him. The mistletoe did not vow, however, as Frigg considered it to be so unimportant that she thought nothing of it. Loki found out that the mistletoe had not vowed, and thus made a spear out of the dreaded plant, and tricked Höðr into throwing it at Baldr. Beings from all across the Nine Realms will come to attend his funeral, and Baldr's wife Nanna soon dies of grief. Loki is soon caught and sentenced to punishment; he is bound by the entrails of one of his sons, to face torture as the venom of a massive serpent drips from its fangs onto Loki's eyes. This causes him unimaginable pain, writhing in agony. (The goddess Skaði is responsible for placing the serpent above him). His wife Sigyn is stationed nearby, collecting the drips of venom into a bowl. When the bowl is full, she leaves to empty it, and when she does, the venom drips onto the trickster and gradually eats away at his flesh. Loki's escape from this predicament is the catalyst of Ragnarök, as upon his being freed, he will lead the forces of Jötunheimr and Svartálfheimr in a final assault against the gods. \n\nDuring Ragnarök, the veils/barriers between the realms will be broken, so Baldr will be able to escape from Helheimr. After the death of Odin at the fangs of the monstrous wolf Fenrir, Baldr and Höðr came back to life, meeting with the other survivors in the fields of Iðavöllr (Old Norse: Iðavǫllr - "splendour-plain"), where Asgard once lay. There, they shall rule in place of their father.	0	5	2025-07-20 18:17:19.208693	2025-07-21 20:25:03.194523	1
10	10 Artificial Intelligence Examples: AI in Practice	Artificial intelligence (AI) is a tool designed to mimic human processing and analytic skills to analyze problems, identify solutions, and decide on courses of action. Unlike traditional technology, artificial intelligence algorithms have the ability to adapt to new information and follow “thought processes” similar to those of a human brain. This type of algorithm can help professionals make informed and data-driven decisions.\n\n\nProfessionals across a wide array of fields use artificial intelligence, with notable applications in finance, education, business, film, and health care. As we continue to expand our understanding of AI and its ability to assist humans in different contexts, the applications of AI are likely to grow steadily in the coming years.\nIn finance, artificial intelligence is a powerful tool that helps financial firms decide who to lend money to. With AI algorithms, banks and other organizations can use the personal information of applicants to decide whether they have a high risk of defaulting on their loans. One of the benefits of AI in this context is that (theoretically) the algorithms make unbiased decisions. These AI algorithms can provide insights that bankers use to make investment and lending decisions depending on user inputs, such as risk preferences and outcome goals. \n\nAI also detects overall risk by finding trends and providing insights that can help organizations lower their risk threshold. 	1	1	2025-07-20 18:13:58.380079	2025-07-21 20:40:57.839502	0
\.


--
-- Data for Name: updoot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.updoot (value, "userId", "postId") FROM stdin;
1	1	7
1	5	8
1	5	7
1	5	3
1	5	2
1	10	14
-1	10	8
1	10	7
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, email, password, "createdAt", "updatedAt", "ratingPts") FROM stdin;
9	Anna	anna@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$lPNWuIXQH6sM2ITbm5LIZA$LSCqCSRy5YIaukMVCdpvpfxLNrUtSlzXpdrRddgijdY	2025-07-15 22:15:13.101431	2025-07-15 22:15:23.70194	10
11	Diego de la vega-zorro	dimitar.i.dimitrov77@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$ERKbgR/ZUm+lnxH/Ckjv0Q$oEnsiXhCs16hEV7n7ycPTRUg+wYQeQAAogK4GjMBSCY	2025-07-19 20:40:19.07235	2025-07-19 20:40:19.137601	10
10	Toncho Dimitrov	tonkata@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$9GwAYinoOLd00PAw4+NHaQ$UcOjFXpzYt+1UncyE2fb9SsBuoLbZgZZHzLn/g7uvG4	2025-07-17 20:42:10.391039	2025-07-20 17:59:23.013788	25
1	Odin_allfather	odin@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$yXD3x6+8MKJcNcOP8ThNdw$C0b04XYUbx52A2PpRsd4QTfxWMQr2KMUSFkj/49NH4A	2025-07-14 20:09:14.114648	2025-07-20 18:13:58.524607	25
5	Thor Oddisson	thor@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$qbRWAAjWy8t9jSTcIQzDEg$Ny734ouE7aeJQ6+R+Nqaw75sMVcnTy0A0RSN0HYQAdQ	2025-07-15 21:31:44.076259	2025-07-20 18:19:58.749528	15
12	Joleyne matisson	joleyne@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$qV06d/oM8StjkV3zYXUcpA$xF255IqcZmT2tkWnvGrO1Nb6JF/4tJBzWwC3WLbBBwA	2025-07-20 18:28:10.467474	2025-07-20 18:33:54.285834	20
\.


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 403, true);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_id_seq', 15, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 12, true);


--
-- Name: audit_logs PK_1bb179d048bbc581caa3b013439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY (id);


--
-- Name: updoot PK_6476d7e464bcb8571004134515c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.updoot
    ADD CONSTRAINT "PK_6476d7e464bcb8571004134515c" PRIMARY KEY ("userId", "postId");


--
-- Name: post PK_be5fda3aac270b134ff9c21cdee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: updoot FK_9df9e319a273ad45ce509cf2f68; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.updoot
    ADD CONSTRAINT "FK_9df9e319a273ad45ce509cf2f68" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: post FK_9e91e6a24261b66f53971d3f96b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES public."user"(id);


--
-- Name: updoot FK_fd6b77bfdf9eae6691170bc9cb5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.updoot
    ADD CONSTRAINT "FK_fd6b77bfdf9eae6691170bc9cb5" FOREIGN KEY ("postId") REFERENCES public.post(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

