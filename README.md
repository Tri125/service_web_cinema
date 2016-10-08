# Projet tp1-web_services

### Fait par Tristan Savaria 1081849


## Déploiement

### Mise à jour de node et installation des packages.

Ces étapes sont importantes car le projet utilise une nouvelle syntaxe javascript imcompatible avec les anciennes versions.

Installons la dernière version de node disponible (actuellement v6.7.0):

`nvm install node`

Spécifions la version de node que nous voulons exécuter en ce moment:

`nvm use node`

Pour finir, spécifions l'alias default pour que la version soit utilisé par défaut même lors d'un redémarrage:

`nvm alias default node`

Installez les packages utilisés par le projet:

`npm install`


### Installation de la base de données.

#### Démarrage

Démarrez le serveur MySQL: 

`mysql-ctl start`

Accédez à la console MySQL à l'aide de:

`mysql-ctl cli`.

#### Installation

À partir de la console MySQL, exécutez les deux scripts nommés `create.sql` et `insert.sql` dans cet ordre.
Les deux scripts sont situés sous le chemin `./database/`.

`source ./database/create.sql`

`source ./database/insert.sql`

#### Configuration

Modifiez le fichier nommé `database.js` situé sous le chemin `./helpers/` selon le compte pour votre accès en base de données.

Il est très probable que vous devez changer la valeur du champ `user` pour correspondre à votre nom de compte.