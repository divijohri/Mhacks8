import re
#PARSING ADDRESSES INTO LIST
parsedList = []
with open("testData.txt", "r") as dataFile:
    encodedData = dataFile.readlines()
    for line in encodedData:
        parsedList.append(re.findall('\"}", "(.*?)", "(.*?)"', line))
#REQUESTING GOOGLE FOR ADDRESS TO LAT LONG
#import requests
#longitudes = []
#latitudes = []
#base_url = 'http://maps.googleapis.com/maps/api/geocode/json'
#for line in parsedList:
#    my_params = {'address': line,
#                 'language': 'ca'}
#    response = requests.get(base_url, params = my_params)
#    results = response.json()['results']
#    x_geo = results[0]['geometry']['location']
#    longitudes.append(x_geo['lng'])
#    latitudes.append(x_geo['lat'])
#    print(x_geo['lng'], x_geo['lat'])
#WRITING PARSED DATA TO FILE
finalList = []
with open("data.txt", "w") as parsedData:
    for aLine in parsedList:
        aLine = re.sub('\'', '', str(aLine))
        aLine = re.sub('\[', '', str(aLine))
        aLine = re.sub('\]', '', str(aLine))
        aLine = re.sub('\(', '[', str(aLine))
        aLine = re.sub('\)', ']', str(aLine))
        finalList.append(aLine)
    done = str(finalList)
    done = re.sub('\'', '', done)
    parsedData.write(done)
