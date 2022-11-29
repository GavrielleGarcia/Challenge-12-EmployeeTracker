# Challenge-12-EmployeeTracker

## Description
 CMS system will help organize your company by adding, deleting, updating or even creating a new data base for the different departments, as their roles, incoming, etc. in an easy way. Even update information already in the system.

## User Story
  
```bash
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```


## Installation
  To install the necessary dependencies, run the following command:
```bash
npm i
npm install dotenv --save
npm install express
npm install --save inquirer
npm install --save mysql2
npm install console.table --save
```

After the dependencies are installed, create a .ENV file and fill it with your connection information. 

Example as follows (Update with you SQL Password):

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS='YOUR PASSWORD'
```

Now, you can proceed to create the datbase schema:

```bash
 #Switch terminal to MySQL
    mysql -u root -p
    # create the wanted DB from squema file
    source db/schema.sql
    # use the existing information from seeds file
    source db/seeds.sql
```

Then, exit the SQL Terminal.

Finally, start working with the main file:

```bash
    node index.js
```

## Technologies Used
 MysSQL
 JavaScript
 Node.js
 

 ## Overview 
 [Link to the video](https://app.screencast.com/mz4wual4HjQq6?conversation=atUQdYtNMvfiUHyrNOk1hA)

 
## Contributing 
 This project is not open for contributions at the moment. Thanks.
 
 
## Questions
  My stuff [gavriellegarcia](https://github.com/gavriellegarcia).

 Send me an owl: gavrielle.garcia@hotmail.com.  
  
