const { ocr } = require("llama-ocr");
const fs = require("fs-extra");
const path = require("path");

const args = process.argv.slice(2);
const dirPath = args[0];
const outputFilePath = path.join(__dirname, "extracted_text.txt");

// Ensure your API key is set in the environment variables
const apiKey = process.env.TOGHETERH_AI_API_KEY;
if (!apiKey) {
  console.error(
    "Please set your Together AI API key in the TOGETHER_API_KEY environment variable."
  );
  process.exit(1);
}

// Check if the image file exists
if (!fs.existsSync(dirPath)) {
  console.error(`Image file not found at path: ${dirPath}`);
  process.exit(1);
}

// Perform OCR
async function processImages() {
  try {
    // Ensure the output file exists
    await fs.ensureFile(outputFilePath);

    // Read all files in the directory
    const files = await fs.readdir(dirPath);

    // Filter image files (e.g., .jpg, .png)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

    // Sort image files alphabetically
    // imageFiles.sort();

    for (const file of imageFiles) {
      const filePath = path.join(dirPath, file);
      console.log(`Processing ${filePath}...`);

      try {
        const markdown = await ocr({
          filePath: filePath,
          apiKey: apiKey,
          model: "Llama-3.2-90B-Vision", // Optional: specify the model
        });

        // Append extracted text to the output file
        await fs.appendFile(
          outputFilePath,
          `\n\n---\n\nExtracted from ${file}:\n\n${markdown}`
        );
        console.log(`Text extracted and appended for ${file}`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
      }
    }

    console.log("Processing completed.");
  } catch (error) {
    console.error("Error during processing:", error);
  }
}

processImages();
