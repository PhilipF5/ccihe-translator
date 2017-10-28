# CCIHE Translator
A simple program to support my ng-college project. Importing the public data file from the [Carnegie Classification of Institutions of Higher Education](http://carnegieclassifications.iu.edu/downloads.php) into MongoDB results in a lot of numerical fields that require the legends from the original file to interpret. Since the legends only represent key-value pairs and not detailed objects, inserting the true values into the MongoDB collection seems like a reasonable approach.

## How to Use
1. Upload the data tab of the 2015 public data file to a MongoDB collection using `mongoimport --type csv`.
2. Update the `package.json` config parameters to reflect the address of your database server and the appropriate database and collection names. **Authentication NOT built-in at the moment.**
3. `npm start`.
