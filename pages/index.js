import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [projects, setProjects] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      try {
        setEthWallet(window.ethereum);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          handleAccount(accounts);
          // Initialize contract after wallet is connected
          getATMContract(provider);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(ethWallet);
      const accounts = await provider.send("eth_requestAccounts", []);
      handleAccount(accounts);
      getATMContract(provider);
    } catch (error) {
      console.error("Error connecting account:", error);
    }
  };

  const getATMContract = async (provider) => {
    try {
      const signer = provider.getSigner();
      const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
      console.log("Contract initialized");
      setATM(atmContract);
      
      // Add a delay before checking the contract state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const count = await atmContract.getTotalProjects();
      console.log("Project count from contract:", count.toString());
    } catch (error) {
      console.error("Error in getATMContract:", error);
    }
  }

  const loadProjects = async() => {
    try {
      if (atm && account) {
        console.log("Loading projects...", { atm: !!atm, account });
        const projectCount = await atm.getTotalProjects();
        console.log("Project count:", projectCount.toString());
        
        const projectsData = [];
        
        for(let i = 0; i < projectCount.toNumber(); i++) {
          try {
            console.log(`Fetching project ${i}...`);
            const [name, description, votes] = await atm.getProjectDetails(i);
            console.log(`Project ${i} details:`, { name, description, votes: votes.toString() });
            projectsData.push({ 
              id: i, 
              name, 
              description, 
              votes: votes.toNumber() 
            });
          } catch (error) {
            console.error(`Error fetching project ${i}:`, error);
          }
        }
        
        console.log("Setting projects:", projectsData);
        setProjects(projectsData);
        
        try {
          if (account[0]) {
            const hasVoted = await atm.hasUserVoted(account[0]);
            console.log("Has voted:", hasVoted);
            setHasVoted(hasVoted);
          }
        } catch (error) {
          console.error("Error checking vote status:", error);
          setHasVoted(false);
        }
      } else {
        console.log("Contract or account not ready:", { 
          contract: !!atm, 
          account: !!account,
          accountDetails: account 
        });
      }
    } catch (error) {
      console.error("Error in loadProjects:", error);
    }
  }

  const vote = async(projectId) => {
    try {
      if (atm) {
        const tx = await atm.castVote(projectId);
        console.log("Vote transaction sent:", tx.hash);
        await tx.wait();
        console.log("Vote transaction confirmed");
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        await loadProjects();
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error casting vote. Please try again.");
    }
  }

  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const initUser = () => {
    if (!ethWallet) {
      return (
        <div className={styles.connectPrompt}>
          <div className={styles.metamaskCard}>
            <img src="/metamask.svg" alt="MetaMask" className={styles.metamaskIcon} />
            <p>Please install MetaMask to use this voting system.</p>
          </div>
        </div>
      );
    }

    if (!account) {
      return (
        <div className={styles.connectPrompt}>
          <div className={styles.metamaskCard}>
            <img src="/metamask.svg" alt="MetaMask" className={styles.metamaskIcon} />
            <button className={styles.connectButton} onClick={connectAccount}>
              Connect MetaMask Wallet
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className={styles.accountInfo}>
          <span className={styles.accountIcon}>🦊</span>
          <span className={styles.accountAddress}>
            Connected: {formatAddress(account[0])}
          </span>
        </div>

        <div className={styles.projectsGrid}>
          {projects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>{project.name}</h3>
                <span className={styles.voteCount}>
                  {project.votes} vote{project.votes !== 1 ? 's' : ''}
                </span>
              </div>
              <p className={styles.projectDescription}>{project.description}</p>
              {!hasVoted ? (
                <button 
                  className={styles.voteButton} 
                  onClick={() => vote(project.id)}
                >
                  Cast Vote
                </button>
              ) : (
                <span className={styles.votedBadge}>Already Voted</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
    }
    getWallet();
  }, []);

  useEffect(() => {
    if (atm && account) {
      console.log("Contract and account ready, loading projects...");
      loadProjects();
    }
  }, [atm, account]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Project Voting System</title>
        <meta name="description" content="Blockchain Project Voting System" />
      </Head>

      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.logo}>VoteChain</div>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.title}>Project Voting System</h1>
          <p className={styles.subtitle}>Vote for your favorite blockchain projects</p>
        </header>
        {initUser()}
      </main>
    </div>
  );
}
