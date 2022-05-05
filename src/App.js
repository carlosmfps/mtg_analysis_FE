import { React, useState } from "react";
import { Heading, Input, Image, Button, Stack, RadioGroup, Radio, ChakraProvider, CheckboxGroup, Checkbox, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from '@chakra-ui/react';
import "./App.css";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [radioValue, setValue] = useState('1');
  const [checkedItems, setCheckedItems] = useState([false, false, false, false, false]);
  const [sliderValues, setSliderValues] = useState([0, 20])
  const [imageLinksList, setImageLinksList] = useState([""])
  const testCard = 'https://c1.scryfall.com/file/scryfall-cards/png/front/0/0/0000579f-7b35-4ed3-b44c-db2a538066fe.png?1562894979'
  let inputHandler = (e) => {
    var lowerCase = e.target.value;

    setInputText(lowerCase);
  };

  let mountColorString = () => {
    let colorString = '';
    if (checkedItems[0]) {
      colorString += 'W';
    }
    if (checkedItems[1]) {
      colorString += 'U';
    }
    if (checkedItems[2]) {
      colorString += 'B';
    }
    if (checkedItems[3]) {
      colorString += 'R';
    }
    if (checkedItems[4]) {
      colorString += 'G';
    }
    return colorString
  };

  let responseConvertion = (response) => {
    let newLinks = [];
    console.log(newLinks);
    for(let i = 0; i< response.data.length; i = i + 1) {
      newLinks.push(response.data[i].image_link);
    }
    setImageLinksList(newLinks);
  };

  let onClickSearch = () => {
    switch (parseInt(radioValue)) {
      case 1:
        console.log("seaching card with name: " + inputText)
        axios.get('http://127.0.0.1:8000/cards/byName?name=' + inputText).then(response => responseConvertion(response));
        break;
      case 2:
        console.log("seaching card with colors: " + mountColorString())
        axios.get('http://127.0.0.1:8000/cards/byColors?colors='+ mountColorString()).then(response => responseConvertion(response));
        break;
      case 3:
        console.log("seaching card with keywords: " + inputText)
        axios.get('http://127.0.0.1:8000/cards/byKeywords?keywords='+ inputText).then(response => responseConvertion(response));
        break;
      case 4:
        console.log("seaching card with power greater than " + sliderValues[0] + " and less than " + sliderValues[1])
        axios.get('http://127.0.0.1:8000/cards/byPower?gte='+ sliderValues[0] + '&lte=' + sliderValues[1]).then(response => responseConvertion(response));
        break;
      case 5:
        console.log("seaching card with toughness greater than " + sliderValues[0] + " and less than " + sliderValues[1])
        axios.get('http://127.0.0.1:8000/cards/byToughness?gte='+ sliderValues[0] + '&lte=' + sliderValues[1]).then(response => responseConvertion(response));
        break;
      default:
        console.log(radioValue)
    }
  }
  return (
    <ChakraProvider>
      <div className="main">
        <Heading paddingTop={'4rem'}>MTG Card Analysis</Heading>
        <div className="search">
          <div className="searchInput">
            <Input
              placeholder="insert your search term"
              onChange={inputHandler}
            />
            <Button colorScheme='teal' variant='solid' onClick={onClickSearch}>
              search
            </Button>
          </div>
          <div className="searchFilters">
            <RadioGroup onChange={setValue} value={radioValue}>
              <Stack direction='row'>
                <Radio value='1'>Card Name</Radio>
                <Radio value='2'>Colors</Radio>
                <Radio value='3'>Keyword</Radio>
                <Radio value='4'>Power</Radio>
                <Radio value='5'>Toughness</Radio>
              </Stack>
              <CheckboxGroup colorScheme='teal' defaultValue={[]}>
                <Stack className="colors" hidden={radioValue !== '2'} spacing={[1, 5]} direction={['column', 'row']}>
                  <Checkbox isChecked={checkedItems[0]} onChange={(e) => { setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/White_Mana.png' alt='White' /></Checkbox>
                  <Checkbox isChecked={checkedItems[1]} onChange={(e) => { setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2], checkedItems[3], checkedItems[4]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/Blue_Mana.png' alt='Blue' /></Checkbox>
                  <Checkbox isChecked={checkedItems[2]} onChange={(e) => { setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked, checkedItems[3], checkedItems[4]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/Black_Mana.png' alt='Black' /></Checkbox>
                  <Checkbox isChecked={checkedItems[3]} onChange={(e) => { setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], e.target.checked, checkedItems[4]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/Red_Mana.png' alt='Red' /></Checkbox>
                  <Checkbox isChecked={checkedItems[4]} onChange={(e) => { setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], e.target.checked]) }}><Image src='https://gatherer.wizards.com/images/Redesign/Green_Mana.png' alt='Green' /></Checkbox>
                </Stack>
              </CheckboxGroup>
              <RangeSlider onChange={(val) => setSliderValues([val[0], val[1]])} hidden={radioValue !== '4' && radioValue !== '5'} defaultValue={[sliderValues[0], sliderValues[1]]} min={0} max={20} step={1}>
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0}>{sliderValues[0]}</RangeSliderThumb>
                <RangeSliderThumb index={1}>{sliderValues[1]}</RangeSliderThumb>
              </RangeSlider>
            </RadioGroup>
          </div>
        </div>
        <div className="queryResults">
          {imageLinksList.map((link) => {
            return <div><Image className="image" src={link} /></div>
          })}
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;