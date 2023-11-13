const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs')
const multer = require('multer');
const path = require('path');

const axios = require('axios'); 

const app=express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render("index");
})

// app.get('/login',(req,res)=>{
//     console.log("login pressed")
// })

app.post("/login", (req, res) => {
    res.render("login.ejs");
  })

app.post("/textinp", (req, res) => {
    res.render("textinp.ejs");
  })


  app.post("/imginp", (req, res) => {
    res.render("imginp.ejs");
  })  

//For Image Recog

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, 'uploads', req.file.originalname);
  console.log(`File uploaded successfully. Location: ${filePath}`);

  const url_img = "http://127.0.0.1:8000/getEmotionFromImage";

  const data = {
    imagePath: filePath
  };

  //For APi call
  axios.post(url_img, data)
  .then(response => {
    // Your API call was successful
    console.log("Emotion:",response.data.emotion);
    console.log("Song Name:",response.data.songNames);
    console.log("Artist Name:",response.data.artistNames);
    apiData=response.data;
    res.render('TextRes.ejs', { data:apiData });
  })
  .catch(error => {
    // Something went wrong
    console.error("Error:", error);
  });

});







// app.post("/incomingImg", (req, res) => {
//   msg=req.body.imgin;
//   console.log(msg);

//   const imageInput = req.body.imgin; 
         
//   imageInput.addEventListener('change', (event) => { 
//     const file = event.target.files[0]; 
//     // Perform further processing with the selected image file 
//     console.log(file); 
//   });
// })


//For the Text Feature
app.post("/incoming", (req, res) => {
  msg=req.body.message;
  console.log(msg);
  const url = "http://127.0.0.1:8000/getEmotionFromText";

// Define the request body as an object
const data = {
  text: msg
};

// Make the POST request
axios.post(url, data)
  .then(response => {
    // Your API call was successful
    console.log("Emotion:",response.data.emotion);
    console.log("Song Name:",response.data.songNames);
    console.log("Artist Name:",response.data.artistNames);
    apiData=response.data;
    res.render('TextRes.ejs', { data:apiData });
  })
  .catch(error => {
    // Something went wrong
    console.error("Error:", error);
  });
  })


  //For the Image Recognition


  


app.listen(3000,()=>console.log("port is running at server 3000"));