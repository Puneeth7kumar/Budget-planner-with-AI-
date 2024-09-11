import os
import pandas as pd

def process_email_file(file_path, label):
    """Reads a file and returns a DataFrame with its content and label."""
    try:
        with open(file_path, 'r', encoding='latin1') as file:
            content = file.read()
            return pd.DataFrame({'text': [content], 'label': [label]})
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return pd.DataFrame(columns=['text', 'label'])

def create_csv_from_files(spam_dir, ham_dir, output_file):
    """Creates a CSV file from spam and ham directories."""
    try:
        # List of spam and ham files
        spam_files = [os.path.join(spam_dir, f) for f in os.listdir(spam_dir) if f.endswith('.txt')]
        ham_files = [os.path.join(ham_dir, f) for f in os.listdir(ham_dir) if f.endswith('.txt')]

        if not spam_files:
            print("No spam files found.")
        if not ham_files:
            print("No ham files found.")
        
        # Process spam files
        spam_data = pd.concat([process_email_file(f, 'spam') for f in spam_files], ignore_index=True)
        
        # Process ham files
        ham_data = pd.concat([process_email_file(f, 'ham') for f in ham_files], ignore_index=True)

        # Combine spam and ham data
        data = pd.concat([spam_data, ham_data], ignore_index=True)
        
        # Save to CSV
        data.to_csv(output_file, index=False)
        print(f"CSV file created successfully: {output_file}")

    except Exception as e:
        print(f"Error creating CSV file: {e}")

# Adjust the directory paths as needed
create_csv_from_files(
    'D:\\budget_planner\\backend\\20030228_spam\\spam', 
    'D:\\budget_planner\\backend\\20021010_easy_ham\\easy_ham', 
    'D:\\budget_planner\\backend\\spam_data.csv'
)
