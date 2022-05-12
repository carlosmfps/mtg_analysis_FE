import { React, useState } from "react";
import { Heading, Input, Image, Button, Stack, RadioGroup, Radio,SliderFilledTrack, ChakraProvider, CheckboxGroup, Checkbox, RangeSlider,Slider, SliderTrack,SliderThumb, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Tooltip } from '@chakra-ui/react';

import "./App.css";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [radioValue, setValue] = useState('1');
  const [colorRadioValue, setColorRadioValue] = useState('1');
  const [checkedItems, setCheckedItems] = useState([false, false, false, false, false]);
  const [sliderValues, setSliderValues] = useState([0, 20]);
  const [costSlider, setCostSlider] = useState(0);
  const [cardsList, setCardsList] = useState([""]);
  const [selectedCard, setSelectedCard] = useState({});

  const DISPLAY_LIST = 'list';
  const DISPLAY_CARD = 'card';
  const DISPLAY_GRAPH = 'graph';
  
  // let elementBeingDisplayed = DISPLAY_CARD;
  const [onDisplay, setOnDisplay] = useState(DISPLAY_LIST);

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
    if (checkedItems[5]) {
      colorString += '&match_all=y'
    } else {
      colorString += '&match_all=n'
    }
    return colorString
  };

  let responseConvertion = (response) => {
    let newCards = [];
    let cardsLimit = 100;
    if (response.data.length < 100) {
      cardsLimit = response.data.length
    }
    for (let i = 0; i < cardsLimit; i = i + 1) {
      newCards.push(response.data[i]);
    }
    setCardsList(newCards);
  };

  let AboveAverageResponseConvertion = (response) => {
    let newCards = [];
    let cardsLimit = 100;
    //console.log(response.data.cards[1]);
    console.log('the average is ' + response.data.calculated_average)
    if (response.data.cards.length < 100) {
      cardsLimit = response.data.cards.length
    }
    for (let i = 0; i < cardsLimit; i = i + 1) {
      newCards.push(response.data.cards[i]);
    }
    setCardsList(newCards);
  }

  let onClickSearch = () => {
    switch (parseInt(radioValue)) {
      case 1:
        console.log("seaching card with name: " + inputText)
        axios.get('http://127.0.0.1:8000/cards/byName?name=' + inputText).then(response => responseConvertion(response));
        break;
      case 2:
        console.log("seaching card with colors: " + mountColorString())
        axios.get('http://127.0.0.1:8000/cards/byColors?colors=' + mountColorString()).then(response => responseConvertion(response));
        break;
      case 3:
        console.log("seaching card with keywords: " + inputText)
        axios.get('http://127.0.0.1:8000/cards/byKeywords?keywords=' + inputText).then(response => responseConvertion(response));
        break;
      case 4:
        console.log("seaching card with power greater than " + sliderValues[0] + " and less than " + sliderValues[1])
        axios.get('http://127.0.0.1:8000/cards/byPower?gte=' + sliderValues[0] + '&lte=' + sliderValues[1]).then(response => responseConvertion(response));
        break;
      case 5:
        console.log("seaching card with toughness greater than " + sliderValues[0] + " and less than " + sliderValues[1])
        axios.get('http://127.0.0.1:8000/cards/byToughness?gte=' + sliderValues[0] + '&lte=' + sliderValues[1]).then(response => responseConvertion(response));
        break;
      case 6:
        console.log("seaching card with power above average from color " + colorRadioValue)
        axios.get('http://127.0.0.1:8000/cards/aboveAverage/byColor?color=' + colorRadioValue).then(response => AboveAverageResponseConvertion(response));
        break;
      case 7:
        console.log("seaching card with power above average from color " + colorRadioValue)
        axios.get('http://127.0.0.1:8000/cards/aboveAverage/byTotalCost?total_cost=' + costSlider).then(response => AboveAverageResponseConvertion(response));
        break;
      default:
        console.log(radioValue)
    }
    setOnDisplay(DISPLAY_LIST);
  }

  let loadSingleCard = (cardId) => {
    console.log('Loading card: ' + cardId);
    axios.get('http://127.0.0.1:8000/cards/byId?id=' + cardId).then(response => {
      setSelectedCard(response.data);
      setOnDisplay(DISPLAY_CARD);
      console.log(response.data)
    });
  }

  let mainDisplay = () => {
    let toDisplay = null;

    if (onDisplay === DISPLAY_LIST) {
      toDisplay = cardsList.map((cardInfo) => {
        return <div>
          <Tooltip label={cardInfo.name}>
            <div onClick={() => loadSingleCard(cardInfo._id)} style={{cursor: 'pointer'}}>
              <Image className="image" src={cardInfo.image_link}  />
            </div>
          </Tooltip>
        </div>
      });
    }
    else if(onDisplay === DISPLAY_CARD) {
      toDisplay = buildCardDisplay(selectedCard);
    }


    return toDisplay;
  }

  let closeCardDisplay = () => {
    setOnDisplay(DISPLAY_LIST);
  }

  let buildCardDisplay = (card) => {
    return (
    <div className="cardDisplay">
      <p className="textCloseCardDisplay" onClick={closeCardDisplay}>Back</p>
      
      <Image className="selectedCardImage" src={card.image_link} />
      <h2 className="cardDisplayTitle">{card.name}</h2>
      <br />
      <p>Name: {card.name}</p>
      <p>Type: {card.type}</p>
      <br />
      <p>{card.oracle_text}</p>
      <br />
      {
        card.power === undefined ?
          ''
          :
          <p>Power: {card.power}</p>
      }
      {
        card.toughness === undefined ?
          ''
          :
          <p>Toughness: {card.toughness}</p>
      }
      {
        card.metrics === undefined ?
        ''
        :
        <div>
          <br />
          <p>Considering cards with same total mana cost and same colors:</p>
          <p>There are {buildListSuggestion(card.metrics.more_power.equal_total_cost_and_colors)} more powerful cards you should check out.</p>
          <p>There are {buildListSuggestion(card.metrics.more_toughness.equal_total_cost_and_colors)} tougher cards you should check out.</p>
          <p>There are {buildListSuggestion(card.metrics.more_power_and_toughness.equal_total_cost_and_colors)} strictly better cards you should check out.</p>
        </div>
      }

    </div>
    );
  }

  const loadSuggestionList = (newList) => {
    setCardsList(newList);
    setOnDisplay(DISPLAY_LIST);
  }

  const buildListSuggestion = (suggestion) => {
    return <span className="listSuggestion" onClick={() => loadSuggestionList(suggestion.cards)}>{suggestion.total}</span>
  }

  return (
    <ChakraProvider>
      <div className="main">
        <Heading paddingTop={'4rem'}>MTG Card Analysis</Heading>
        <div className="search">
          <div className="searchInput">
            <Input
              placeholder="insert your search term or number when appliable"
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
                <Radio value='6'>Above Average by color</Radio>
                <Radio value='7'>Above Average by total cost</Radio>
              </Stack>
            </RadioGroup>
            <CheckboxGroup colorScheme='teal' defaultValue={[]}>
              <Stack className="colors" hidden={radioValue !== '2'} spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox isChecked={checkedItems[0]} onChange={(e) => { setCheckedItems([e.target.checked, checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4], checkedItems[5]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/White_Mana.png' alt='White' /></Checkbox>
                <Checkbox isChecked={checkedItems[1]} onChange={(e) => { setCheckedItems([checkedItems[0], e.target.checked, checkedItems[2], checkedItems[3], checkedItems[4], checkedItems[5]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/Blue_Mana.png' alt='Blue' /></Checkbox>
                <Checkbox isChecked={checkedItems[2]} onChange={(e) => { setCheckedItems([checkedItems[0], checkedItems[1], e.target.checked, checkedItems[3], checkedItems[4], checkedItems[5]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/Black_Mana.png' alt='Black' /></Checkbox>
                <Checkbox isChecked={checkedItems[3]} onChange={(e) => { setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], e.target.checked, checkedItems[4], checkedItems[5]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/Red_Mana.png' alt='Red' /></Checkbox>
                <Checkbox isChecked={checkedItems[4]} onChange={(e) => { setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], e.target.checked, checkedItems[5]]) }}><Image src='https://gatherer.wizards.com/images/Redesign/Green_Mana.png' alt='Green' /></Checkbox>
                <Checkbox isChecked={checkedItems[5]} onChange={(e) => { setCheckedItems([checkedItems[0], checkedItems[1], checkedItems[2], checkedItems[3], checkedItems[4], e.target.checked]) }}>Match All Colors</Checkbox>
              </Stack>
            </CheckboxGroup>
            <RadioGroup onChange={setColorRadioValue} value={colorRadioValue}>
              <Stack className="colors" hidden={radioValue !== '6'} spacing={[1, 5]} direction={'row'}>
                <Radio value='W'><Image src='https://gatherer.wizards.com/images/Redesign/White_Mana.png' alt='White' /></Radio>
                <Radio value='U'><Image src='https://gatherer.wizards.com/images/Redesign/Blue_Mana.png' alt='Blue' /></Radio>
                <Radio value='B'><Image src='https://gatherer.wizards.com/images/Redesign/Black_Mana.png' alt='Black' /></Radio>
                <Radio value='R'><Image src='https://gatherer.wizards.com/images/Redesign/Red_Mana.png' alt='Red' /></Radio>
                <Radio value='G'><Image src='https://gatherer.wizards.com/images/Redesign/Green_Mana.png' alt='Green' /></Radio>
              </Stack>
            </RadioGroup>
            <RangeSlider onChange={(val) => setSliderValues([val[0], val[1]])} hidden={radioValue !== '4' && radioValue !== '5'} defaultValue={[sliderValues[0], sliderValues[1]]} min={0} max={20} step={1}>
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0}>{sliderValues[0]}</RangeSliderThumb>
              <RangeSliderThumb index={1}>{sliderValues[1]}</RangeSliderThumb>
            </RangeSlider>
            <Slider onChange={(val) => setCostSlider(val)} hidden={radioValue !== '7'} defaultValue={0} min={0} max={16} step={1}>
              <SliderTrack>
                <SliderFilledTrack/>
              </SliderTrack>
              <SliderThumb >{costSlider}</SliderThumb>
            </Slider>
          </div>
        </div>
        <div className="queryResults">
          {
            mainDisplay()
          }
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;