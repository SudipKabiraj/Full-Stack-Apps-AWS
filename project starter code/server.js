import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req, res) => {
    try {
      // 1. Validate the image_url query parameter
      const imageUrl = req.query.image_url;
      
      if (!imageUrl) {
        return res.status(400).send({ error: "image_url query parameter is required" });
      }

      // Validate that it's a valid URL
      try {
        new URL(imageUrl);
      } catch (err) {
        return res.status(400).send({ error: "image_url must be a valid URL" });
      }

      // 2. Call filterImageFromURL to filter the image
      const filteredImagePath = await filterImageFromURL(imageUrl);

      // 3. Send the resulting file in the response with status 200
      res.status(200).sendFile(filteredImagePath, (err) => {
        if (err) {
          console.log("Error sending file:", err);
        }
        // 4. Delete any files on the server after the response is sent
        deleteLocalFiles([filteredImagePath]);
      });

    } catch (error) {
      // Return 422 for unprocessable entity (e.g., invalid image)
      res.status(422).send({ error: "Unable to filter the image. Please provide a valid image URL." });
    }
  });

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
