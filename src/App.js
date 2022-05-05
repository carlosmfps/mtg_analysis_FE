import { React, useState } from "react";
import { Input, Image, Button, Stack, RadioGroup, Radio, ChakraProvider, CheckboxGroup, Checkbox, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from '@chakra-ui/react';
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [radioValue, setValue] = useState('1');
  const [checkedItems, setCheckedItems] = useState([false, false, false, false, false]);
  const [sliderValues, setSliderValues] = useState([0,20])
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();

    setInputText(lowerCase);
  };
  return (
    <ChakraProvider>
      <div className="main">
        <h1>MTG Card Analysis</h1>
        <div className="search">
          <Input
            placeholder="insert your search term"
            onChange={inputHandler}
          />
          <Button colorScheme='teal' variant='solid' onClick={() => console.log(inputText)}>
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
            <RangeSlider onChange={(val) => setSliderValues([val[0],val[1]])} hidden={radioValue !== '4' && radioValue !== '5'} defaultValue={[sliderValues[0], sliderValues[1]]} min={0} max={20} step={1}>
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0}>{sliderValues[0]}</RangeSliderThumb>
              <RangeSliderThumb index={1}>{sliderValues[1]}</RangeSliderThumb>
            </RangeSlider>
            <div className="queryResults">
              
            </div>
          </RadioGroup>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;