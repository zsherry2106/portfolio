import pandas as pd
import requests

from bs4 import BeautifulSoup
import re
import json

#create list of drugs here - use kegg ids
all_drugs = []

def kegg_pull_target(entry_id):
    stem = "https://www.kegg.jp/entry/"

    full_url = stem + entry_id

    #use requests to pull str that contains all data on the drug's kegg id
    kegg_info = requests.get(full_url)

    #use Beautiful Soup to pull text information from kegg
    #.get_text transfers html information into text form
    drug_txt = BeautifulSoup(kegg_info.text, 'html.parser').get_text()

    #formatting has "Targets" and then new line and then a line of targets
    #use this method to get the line of targets
    start_index = drug_txt.find('Target')+7
    end_index = drug_txt.find('\n',start_index)
    targets_str = drug_txt[start_index:end_index]

    #remove excess information in brackets
    targets_str=re.sub("\[.*?\]","",targets_str)

    #convert str of drugs into list
    targets_list = targets_str.split()

    return targets_list

target_dict_chembl = {}
for drug in all_drugs:

    # find targets from ChEMBL
    targets = kegg_pull_target(drug)
    if len(targets) > 0:
        target_dict_chembl[drug] = targets

with open('kegg_sherry_test.txt', 'w') as convert_file: 
    convert_file.write(json.dumps(target_dict_chembl))
