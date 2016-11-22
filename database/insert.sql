INSERT INTO Cinemas (uuid, nom, adresse, ville, codePostal, telephone) VALUES 
('51f96775-474a-459d-97c3-a513e71e8ee5', 'Cinéma Banque Scotia Montréal', '977 Rue Sainte-Catherine', 'Montréal', 'H3B4W3', '5148420549'),
('dc011b68-e49f-40b5-bde8-85f0f25bf673', 'Cinéma Starcité Montréal', '4825 Avenue Pierre-De Coubertin', 'Montréal', 'H1V3V4', '5148998979'),
('fe5eec00-4a8c-4dc7-962a-82c88fe52529', 'Cinémas Guzzo', '901 Boulevard Crémazie O', 'Montréal', 'H4N3M5', '5143855566'),
('472e5df7-0a5e-46c5-b9dd-cf5978b50bf6', 'Cinema du Parc', '3575 Av du Parc', 'Montréal', 'H2X2H8', '5142811900');

INSERT INTO Films (uuid, titre, pays, genre, classe, duree, realisateur, imageUrl) VALUES
('18c86669-7019-4ed0-8fc0-7149b31ca8b2', 'Deadpool', "États-Unis d\'Amérique", 'Action', '13+', 108, 'Tim Miller', 'https://tp1-web-services-tri125.c9users.io/static/img/deadpool.jpg'),
('15568f9a-caec-4f38-8fb8-1ae74c878fd2', 'Dredd', "États-Unis d\'Amérique", 'Action', '16+', 95, 'Pete Travis', 'https://tp1-web-services-tri125.c9users.io/static/img/dredd.png'),
('802796e9-fa48-4b10-b852-87f068713cbb', 'Fury', "États-Unis d\'Amérique", 'Action', '13+', 134, 'David Ayer', 'https://tp1-web-services-tri125.c9users.io/static/img/fury.jpg'),
('f3982520-d65b-4b9b-a63b-98863e450142', 'Les 8 enragés', "États-Unis d\'Amérique", 'Mystère', '13+', 167, 'Quentin Tarantino', 'https://tp1-web-services-tri125.c9users.io/static/img/8_enrages.png'),
('614eed81-1c29-48e5-97dc-6f660ed3e3e5', 'Interstellaire', "États-Unis d\'Amérique", 'Drame', 'G', 168, 'Christopher Nolan', 'https://tp1-web-services-tri125.c9users.io/static/img/interstellaire.jpg'),
('d5e20db7-ff3b-4de5-93cb-3134e4ce25f4', 'Mad Max : La route du chaos', 'Australie', 'Action', '13+', 120, 'George Miller', 'https://tp1-web-services-tri125.c9users.io/static/img/mad_max_la_route_du_chaos.jpg'),
('4a8b96ef-e97c-4b2b-861f-52dba0af61ec', 'John Wick', 'Canada', 'Action', '13+', 101, 'Chad Stahelski', 'https://tp1-web-services-tri125.c9users.io/static/img/john_wick.jpg'),
('61600dc3-fd7a-44a7-8750-c32dacd8cb97', 'Warcraft', "États-Unis d\'Amérique", 'Aventures fantastiques', 'G', 123, 'Duncan Jones', 'https://tp1-web-services-tri125.c9users.io/static/img/warcraft.png'),
('24b9f3e9-ab9b-4817-bdab-a5d4e02f5195', 'Seul sur Mars', "États-Unis d\'Amérique", 'Science-fiction', 'G', 141, 'Ridley Scott', 'https://tp1-web-services-tri125.c9users.io/static/img/seul_sur_mars.jpg'),
('2f1edf7b-bb04-40f1-a820-0fea2d8df3d2', 'Les Nouveaux héros', "États-Unis d\'Amérique", 'Animation', 'G', 102, 'Don Hall', 'https://tp1-web-services-tri125.c9users.io/static/img/les_nouveaux_heros.jpg'),
('b7534f79-bd08-40f0-9235-b7295daa2b96', 'Sens dessus dessous', "États-Unis d\'Amérique", 'Animation', 'G', 95, 'Jonas Rivera', 'https://tp1-web-services-tri125.c9users.io/static/img/sens_dessus_dessous.jpg');

INSERT INTO Horaires (uuid, idFilm, idCinema, dateHeure) VALUES
("484aa1c4-2455-4a66-8749-959611da1bf2", 1, 1, '2016-08-20 10:08:37'),
("06f9f9bb-3d8f-4e1c-8ee6-f7665ffad720", 2, 3, '2017-03-31 18:24:43'),
("81676ea5-2043-4209-ab08-26a2e76df08c", 3, 2, '2017-05-21 10:53:05'),
("e5fc7aa4-10f2-4bc2-afa2-079efee577de", 4, 1, '2017-05-16 06:51:40'),
("5ac084aa-4363-4bf1-af32-37911e2b1077", 5, 3, '2017-07-13 14:48:21'),
("cf2ba73a-e623-4fc8-a766-b629b43aa4b5", 6, 2, '2017-08-08 12:15:00'),
("f9dc43e9-97ad-4f62-9816-ddc528449de4", 7, 3, '2017-08-21 16:40:05'),
("fd68b03c-e9e1-45bc-91a4-b1963940f67f", 8, 1, '2017-02-13 00:01:47'),
("e3fbce7f-af49-4d77-b43a-aa05296bc796", 9, 2, '2017-03-25 08:34:18'),
("8ca00b82-5194-4580-b6b1-56816ce1d87c", 10, 3, '2017-08-26 05:19:21'),
("9d4ce73b-aa80-4332-b071-6bf8ca2821d6", 11, 4, '2017-02-05 20:30:49'),
("5ce6cf5d-dfbd-4d18-9203-0434e5c58b5b", 1, 2, '2017-03-23 00:34:16'),
("16583ad0-73dc-40d2-8372-6f8dac1f581c", 2, 2, '2017-07-20 02:59:15'),
("3e62cbf1-cd77-4e1a-8b39-a14e8f4e7af1", 3, 1, '2017-05-07 04:32:22'),
("a34dab8f-5270-48d7-b690-c0c6450321d4", 4, 3, '2017-03-09 11:20:40'),
("99f92e14-d686-4963-88a8-7c2d85121677", 5, 2, '2017-09-03 18:15:37'),
("1c75e351-d112-4b10-80b5-66abe2d0dab7", 6, 1, '2017-03-26 19:30:47'),
("47897e2c-ea3c-48bd-8a48-b180dc8669a7", 7, 1, '2016-05-20 03:53:30'),
("b9b8e18c-a5f9-4b51-a045-38c059993917", 8, 2, '2017-05-11 11:01:06'),
("67b7bad3-39de-4f96-b48c-d080c367d0c3", 8, 2, '2017-05-11 14:01:06'),
("b92fab41-4873-4854-ae42-24ffa8a840a6", 9, 1, '2017-03-24 02:29:51'),
("b14f470d-9b26-4cb8-bdaf-8132ed34edb2", 9, 1, '2017-03-24 04:29:51'),
("5b3aec80-b2cd-4054-a76c-744c3b898d2d", 9, 1, '2017-03-24 06:29:51');


INSERT INTO Commentaires (uuid, idFilm, texte, note, auteur, dateHeure) VALUES
('359f602e-dc51-481c-8871-24f8b85b0347', 1, "Performance incroyable. Mon film favori de l\'année.", 10, "Andrew", "2016-09-09 21:13:20"),
('3e51afe9-253f-430a-a880-53d1ed2740ab', 1, "Mon enfant de quatre an est un meilleur acteur. Gaspillage d\'argent.", 1, "Alain", "2016-03-02 21:47:02"),
('4f61e711-6aa0-4055-86bc-3fafceb84520', 1, "Bon film pour toute la famille.", 8, "Jack", "2016-05-01 05:04:38"),
('b36d7937-bec2-4709-9540-90456b242c88', 2, "Pour un film non domestique, je suis impressionné.", 7, "Samuel", "2016-04-09 14:52:32"),
('7e09f31e-e8e0-4636-b5d2-b0b11653f9e6', 2, "Fort divertissant.", 9, "Éric", "2016-06-17 08:36:07"),
('2c7613ff-751d-497c-9935-779bc515d646', 3, "Trop peu de budget et sa parrait.", 3, "Jeffrey", "2016-02-29 13:39:25"),
('28a625e0-b1f3-4f2f-a2ff-ff1d31d17b3d', 6, "Le long métrage obtient encore la première place du classement ce week-end. Un most!", 9, "George", "2016-05-29 09:21:53"),
('fc188e3b-ddef-4b10-8c75-b373da71cc0b', 4, "Un autre film générique sans substance.", 5, "Alain", "2016-03-29 18:05:08"),
('3d6eb29e-0136-4762-bf5d-db2db3a7aa8d', 4, "Sauvez-vous de cet horrible film. Votre argent sera plus utile en investissant dans les bitcoins.", 1, "Alain", "2016-05-11 23:57:07"),
('c785e157-8a7e-4550-a82f-5bf4cd3e85f5', 4, "Super!", 8, "Simon", "2016-01-17 23:33:26");