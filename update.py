import os
import sys
import subprocess
import logging
import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"schedule_log_{datetime.datetime.now().strftime('%Y_%m_%d')}.txt"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("Portfolio Blogger")

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def run_cmd(cmd, script_path='', args=None):
    """
    Run a Python script as a subprocess and wait for it to complete.
    
    Args:
        script_path (str): Path to the Python script to run
        args (list, optional): Command-line arguments to pass to the script
    
    Returns:
        bool: True if script executed successfully, False otherwise
    """
    try:
        if script_path:
            full_path = os.path.join(SCRIPT_DIR, script_path)
        else:
            full_path = ''

        # cmd = [sys.executable, full_path]

        # if args:
            # cmd.extend(args)
            
        logger.info(f"Starting: {' '.join(cmd)}")
        
        # Run the process and wait for it to complete
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Capture output
        stdout, stderr = process.communicate()
        
        # Log summary of output
        if stdout:
            logger.info(f"Script output summary: {stdout[:500]}..." if len(stdout) > 500 else f"Script output: {stdout}")
        
        # Check return code
        if process.returncode == 0:
            logger.info(f"Successfully completed: {script_path}")
            return True
        else:
            logger.error(f"Script failed with return code {process.returncode}: {script_path}")
            if stderr:
                logger.error(f"Error details: {stderr}")
            return False
            
    except Exception as e:
        logger.error(f"Exception running {script_path}: {str(e)}")
        return False


def run_all_cmd():
    """Running command to build the project"""
    if run_cmd("npm run build"):
        logger.info("Build successful")
    else:
        logger.error("Build failed")


if __name__ == "__main__":
    run_all_cmd()
