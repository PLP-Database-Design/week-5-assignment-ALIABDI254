// Import dependencies
const express = require ('express');
const app = express();

const mysql = require ('mysql2');
const cors = require ('cors');
const dotenv = require ('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connecting to database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

//Check for connection
db.connect((err) => {
  if(err) return console.log('Error connecting to MYSQL');

  console.log('Connected to MYSQL as id:',db.threadId);
});

app.set('view engine', 'ejs');
app.set('views',__dirname + '/views');
//GET METHOD
app.get('/data', (req,res) => {
  // Retrieve data from database
  //question 1
  let query1 = 'SELECT patient_id, first_name, last_name FROM patients';
  db.query(query1, (error1, result1) => {
    if(error1){
      console.error(error1);
      res.status(500).send('Error retrieving query 1');
      return;
    } 
  
    //question 2
    let query2 = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query2, (error2, result2) => {
      if(error2){
        console.error(error2);
        res.status(500).send('Error retrieving query 2');
        return;
      } 

      //question 3
      let query3 = 'SELECT first_name FROM patients';
      db.query(query3, (error3, result3) => {
        if(error3){
          console.error(error3);
          res.status(500).send('Error retrieving  query 3');
          return;
        } 

        //question 4
        let query4 = `SELECT provider_specialty, GROUP_CONCAT(CONCAT(first_name,' ', last_name)) AS Providers FROM providers GROUP BY provider_specialty`;
        db.query(query4, (error4, result4) => {
          if(error4){
            console.error(error4);
            res.status(500).send('Error retrieving query 4');
            return;
          } 
    
        // Display the patients records to the browser
        res.render('data', {data1:result1, data2:result2, data3:result3, data4:result4});
        });
      });
    });
  });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);

  //Send message to browser
  console.log('Sending message to the browser...')
  app.get('/', (req,res) => {
    res.send('Rada rada ni gani! Baroda!!');
  });
});