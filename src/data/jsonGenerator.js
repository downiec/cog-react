/* eslint-disable */
/**
 * This script will read several JSON files containing raw data needed for the application
 * and will then generate an a file which will contain data needed by jsonReader.ts
 */

const fs = require("fs");

// DIRECTORIES
const JSON_INPUT_DIR = "src/data/json/";
const JSON_OUTPUT_DIR = "src/data/output/";
const JSON_VARDATA_DIR = "src/data/json/variable_data/";

// INPUT FILE NAMES
const ACTIVITY_JSON = "CMIP6_activity_id.json";
const EXPERIMENT_JSON = "CMIP6_experiment_id.json";
const FREQUENCY_JSON = "CMIP6_frequency.json";
const REALMS_JSON = "CMIP6_realm.json";
const MODEL_JSON = "CMIP6_source_id.json";

// OUTPUT FILE NAMES
const MAIN_FILE = "appdata.ts";
const VARIABLE_FILE = "variableData.ts";

// Basic constants
const HEADER = "/* eslint-disable import/prefer-default-export */ \
//This file contains JSON objects needed for application.\n\n";

const dataKeys = {
  activity: "activityData",
  experiment: "experimentData",
  frequency: "frequencyData",
  realm: "realmData",
  variable: "variableData",
  model: "modelData",
};

// Writes data synchronously to specified file (creates if doens't exist), returns message when finished.
function writeToFile(file, data, message) {
  fs.writeFileSync(file, data);
  console.log(message);
}

// Appends data synchronously to specified file, returns message when finished.
function appendToFile(file, data, message) {
  fs.appendFileSync(file, data);
  console.log(message);
}

// Reads JSON data from file, parses and returns data as string.
function readJSONdata(JSONfile) {
  const rawData = fs.readFileSync(JSONfile);
  const parsedData = JSON.parse(rawData);
  return parsedData;
}

// Creates object of activity data from input file and appends it to output file
function appendActivitiesData(key, inputFile, outputFile) {
  const json = readJSONdata(inputFile);
  const exportString = `export const ${key}=${JSON.stringify(
    json.activity_id
  )};\n\n`;
  appendToFile(outputFile, exportString, "Activities built!");
  return json;
}

// Creates object of experiment data from input file and appends it to output file
function appendExperimentsData(key, inputFile, outputFile) {
  const json = readJSONdata(inputFile);
  const exportString = `export const ${key}=${JSON.stringify(
    json.experiment_id
  )};\n\n`;
  appendToFile(outputFile, exportString, "Experiments built!");
  return json;
}

// Creates object of frequency data from input file and appends it to output file
function appendFrequencyData(key, inputFile, outputFile) {
  const json = readJSONdata(inputFile);
  const exportString = `export const ${key}=${JSON.stringify(
    json.frequency
  )};\n\n`;
  appendToFile(outputFile, exportString, "Frequencies built!");
  return json;
}

// Creates object of frequency data from input file and appends it to output file
function appendRealmData(key, inputFile, outputFile) {
  const json = readJSONdata(inputFile);
  const exportString = `export const ${key}=${JSON.stringify(json.realm)};\n\n`;
  appendToFile(outputFile, exportString, "Realm data built!");
  return json;
}

// Creates object of source ID data from input file and appends it to output file
function appendModelData(key, inputFile, outputFile) {
  const json = readJSONdata(inputFile);
  const exportString = `export const ${key}=${JSON.stringify(
    json.source_id
  )};\n\n`;
  appendToFile(outputFile, exportString, "Source ID built!");
  return json;
}

// Creates an object containing variable data from specified directory of JSON files
function createVariablesFiles(key, directory, outputFile) {
  // Get and create object containing a dictionary for each frequency
  console.log("=======Generating variable data files=======");

  let jsonData;
  const variables = {};

  // listing all files using forEach
  const files = fs.readdirSync(directory);
  console.log("Reading through directory contents..");
  files.forEach(function(file) {
    // Read JSON from file
    jsonData = readJSONdata(`${directory}/${file}`).variable_entry;

    if (jsonData) {
      // Take each variable from file and add to variable data
      Object.keys(jsonData).forEach((variable) => {
        if (variables[variable]) {
          variables[variable].push(jsonData[variable]);
        } else {
          variables[variable] = [jsonData[variable]];
        }
      });

      console.log(`Processed file: ${file}`);
    }
  });
  console.log("Data processed, creating file...");

  // Write the variableData JSON
  const header = `\/\/This file contains the variables found in: ${directory}\n
  export const ${key}=${JSON.stringify(variables)}`;
  writeToFile(outputFile, header, "Variables file complete!");
}

// Creates the main data file containing objects for use in application
function createMainDataFile() {
  // Create empty file with specified header
  writeToFile(
    `${JSON_OUTPUT_DIR}${MAIN_FILE}`,
    HEADER,
    "=======Generating main data file======="
  );
  // Append various data into file
  appendActivitiesData(
    dataKeys.activity,
    `${JSON_INPUT_DIR}${ACTIVITY_JSON}`,
    `${JSON_OUTPUT_DIR}${MAIN_FILE}`
  );
  appendExperimentsData(
    dataKeys.experiment,
    `${JSON_INPUT_DIR}${EXPERIMENT_JSON}`,
    `${JSON_OUTPUT_DIR}${MAIN_FILE}`
  );
  appendFrequencyData(
    dataKeys.frequency,
    `${JSON_INPUT_DIR}${FREQUENCY_JSON}`,
    `${JSON_OUTPUT_DIR}${MAIN_FILE}`
  );
  appendRealmData(
    dataKeys.realm,
    `${JSON_INPUT_DIR}${REALMS_JSON}`,
    `${JSON_OUTPUT_DIR}${MAIN_FILE}`
  );
  appendModelData(
    dataKeys.model,
    `${JSON_INPUT_DIR}${MODEL_JSON}`,
    `${JSON_OUTPUT_DIR}${MAIN_FILE}`
  );
  console.log("\n");
}

function main() {
  console.log(`Obtaining input JSON data from directory: ${JSON_INPUT_DIR}\n`);

  createMainDataFile(); // Creates data files used for dropdowns

  // Creates data files for variables, pre-ordered by frequency and realm
  createVariablesFiles(
    dataKeys.variable,
    JSON_VARDATA_DIR,
    `${JSON_OUTPUT_DIR}${VARIABLE_FILE}`
  );

  console.log("Data file generation complete!\n\n");
  console.log(`Output files saved in: ${JSON_OUTPUT_DIR}`);
}

main();
