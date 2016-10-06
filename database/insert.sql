INSERT INTO Cinemas (uuid, nom, adresse, ville, codePostal, telephone) VALUES 
('51f96775-474a-459d-97c3-a513e71e8ee5', 'Cinéma Banque Scotia Montréal', '977 Rue Sainte-Catherine', 'Montréal', 'H3B4W3', '5148420549'),
('dc011b68-e49f-40b5-bde8-85f0f25bf673', 'Cinéma Starcité Montréal', '4825 Avenue Pierre-De Coubertin', 'Montréal', 'H1V3V4', '5148998979'),
('fe5eec00-4a8c-4dc7-962a-82c88fe52529', 'Cinémas Guzzo', '901 Boulevard Crémazie O', 'Montréal', 'H4N3M5', '5143855566'),
('472e5df7-0a5e-46c5-b9dd-cf5978b50bf6', 'Cinema du Parc', '3575 Av du Parc', 'Montréal', 'H2X2H8', '5142811900');

INSERT INTO Films (uuid, titre, pays, genre, classe, duree, realisateur) VALUES
('18c86669-7019-4ed0-8fc0-7149b31ca8b2', 'Deadpool', "États-Unis d\'Amérique", 'Action', '13+', 108, 'Tim Miller'),
('15568f9a-caec-4f38-8fb8-1ae74c878fd2', 'Dredd', "États-Unis d\'Amérique", 'Action', '16+', 95, 'Pete Travis'),
('802796e9-fa48-4b10-b852-87f068713cbb', 'Fury', "États-Unis d\'Amérique", 'Action', '13+', 134, 'David Ayer'),
('f3982520-d65b-4b9b-a63b-98863e450142', 'Les 8 enragés', "États-Unis d\'Amérique", 'Mystère', '13+', 167, 'Quentin Tarantino'),
('614eed81-1c29-48e5-97dc-6f660ed3e3e5', 'Interstellaire', "États-Unis d\'Amérique", 'Drame', 'G', 168, 'Christopher Nolan'),
('d5e20db7-ff3b-4de5-93cb-3134e4ce25f4', 'Mad Max : La route du chaos', 'Australie', 'Action', '13+', 120, 'George Miller'),
('4a8b96ef-e97c-4b2b-861f-52dba0af61ec', 'John Wick', 'Canada', 'Action', '13+', 101, 'Chad Stahelski'),
('61600dc3-fd7a-44a7-8750-c32dacd8cb97', 'Warcraft', "États-Unis d\'Amérique", 'Aventures fantastiques', 'G', 123, 'Duncan Jones'),
('24b9f3e9-ab9b-4817-bdab-a5d4e02f5195', 'Seul sur Mars', "États-Unis d\'Amérique", 'Science-fiction', 'G', 141, 'Ridley Scott'),
('2f1edf7b-bb04-40f1-a820-0fea2d8df3d2', 'Les Nouveaux héros', "États-Unis d\'Amérique", 'Animation', 'G', 102, 'Don Hall'),
('b7534f79-bd08-40f0-9235-b7295daa2b96', 'Sens dessus dessous', "États-Unis d\'Amérique", 'Animation', 'G', 95, 'Jonas Rivera');

INSERT INTO Horaires (idFilm, idCinema, dateHeure) VALUES
(1, 1, '2016-08-20 10:08:37'),
(2, 3, '2016-03-31 18:24:43'),
(3, 2, '2016-05-21 10:53:05'),
(4, 1, '2016-05-16 06:51:40'),
(5, 3, '2016-07-13 14:48:21'),
(6, 2, '2016-08-08 12:15:00'),
(7, 3, '2016-08-21 16:40:05'),
(8, 1, '2016-02-13 00:01:47'),
(9, 2, '2016-03-25 08:34:18'),
(10, 3, '2016-08-26 05:19:21'),
(11, 4, '2016-02-05 20:30:49'),
(1, 2, '2016-03-23 00:34:16'),
(2, 2, '2016-07-20 02:59:15'),
(3, 1, '2016-05-07 04:32:22'),
(4, 3, '2016-03-09 11:20:40'),
(5, 2, '2016-09-03 18:15:37'),
(6, 1, '2016-03-26 19:30:47'),
(7, 1, '2016-05-20 03:53:30'),
(8, 2, '2016-05-11 11:01:06'),
(9, 1, '2016-03-24 02:29:51');


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