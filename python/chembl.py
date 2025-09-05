#!usr/env/python3
# pull drug targets from databases
import pandas as pd
import re
# ChEMBL
from chembl_webresource_client.new_client import new_client

#uniprot
import urllib.parse
import urllib.request

import json
import itertools
import requests


all_drugs = pd.read_csv('/Users/sherryzhang/Desktop/pdx/missing.csv')
all_drugs = list(all_drugs['drug'])
# print(all_drugs)


molecule = new_client.molecule

def find_target_id(molecule_id):
    #use requests to search for proper targets
    stem = "https://www.ebi.ac.uk"
    #automatically limits number of entries returned to 20, but every after becomes redundant, including targets like mice
    #use f string to put molecule_id in the url
    full_url = stem + "/chembl/api/data/activity.json?molecule_chembl_id__in={}".format(molecule_id)

    #get json file of molecule information in dictionary form
    molecule_dictionary = requests.get(full_url).json()

    #if there are less than 20 results, get the number of results so that next line works properly
    min_range = min(len(molecule_dictionary['activities']), 20)

    #get target ids from the dicionary
    target_ids = [molecule_dictionary['activities'][i]['target_chembl_id'] for i in range(min_range)]

    return target_ids


def target_from_chembl(drug):
    """
    """
    print(drug)

    #some drugs have names like "TN" which time out the molecule.search and throw an error, so I added a try/except
    try:
        #find drug chembl id
        #take only the first search result, I found that every after was either redundant or became inaccurate
        res = molecule.search(drug)

        #if a molecule is found, then continue to search for the target
        if len(res) >0:
            #uses res to find drug id
            all_chembl_id = [res[0]['molecule_chembl_id']]

            #use function I wrote above to get the target ids
            target_ids = find_target_id(all_chembl_id[0])
            # print(target_ids)

            #remove duplicate ids
            target_ids = list(set(target_ids))
            # print(len(target_ids))

            #filter to get dictionaries that contain all information about each target
            targets_dicts = new_client.target.filter(target_chembl_id__in=target_ids).only(['target_components'])

            #'accession' gives uniprot code so conversion is not necessary
            #iterate through list of target component dictionaries and skip the ones that don't have any contents
            targets = [dict1['target_components'][0]['accession'] for dict1 in targets_dicts if len(dict1['target_components']) !=0]

            print(targets)
            return targets

        else:
            empty = []
            return empty
        
    except:
        empty = []
        return empty



target_dict_chembl = {}
for drug in all_drugs:

    # find targets from ChEMBL
    symbols = target_from_chembl(drug)
    if len(symbols) > 0:
        target_dict_chembl[drug] = symbols

print(target_dict_chembl)

with open('chembl_sherry_test.txt', 'w') as convert_file: 
    convert_file.write(json.dumps(target_dict_chembl))

