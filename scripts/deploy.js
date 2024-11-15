// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  console.log("Deploying Assessment contract...");
  
  // Deploy the contract
  const assessment = await Assessment.deploy();
  
  // Wait for deployment to finish
  await assessment.deployed();
  console.log("Assessment contract deployed to:", assessment.address);

  // Wait for a few blocks to ensure contract is deployed
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay

  try {
    // Verify deployment by checking initial projects
    const projectCount = await assessment.getTotalProjects();
    console.log("Initial number of projects:", projectCount.toString());
    
    if (projectCount.toNumber() > 0) {
      // Get and log all project details
      for (let i = 0; i < projectCount.toNumber(); i++) {
        const project = await assessment.getProjectDetails(i);
        console.log(`Project ${i}:`, {
          name: project[0],
          description: project[1],
          votes: project[2].toString()
        });
      }
    } else {
      console.log("Warning: No projects initialized!");
    }
    
  } catch (error) {
    console.error("Error verifying deployment:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
