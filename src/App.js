import { React, useState } from "react";
import { Heading, Input, Image, Button, Stack, RadioGroup, Radio,SliderFilledTrack, ChakraProvider, CheckboxGroup, Checkbox, RangeSlider,Slider, SliderTrack,SliderThumb, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Tooltip, requiredChakraThemeKeys } from '@chakra-ui/react';

import Chart from 'chart.js/auto';

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
  const [currentCharts, setCurrentCharts] = useState([]);

  const DISPLAY_LIST = 'list';
  const DISPLAY_CARD = 'card';
  const DISPLAY_GRAPH = 'graph';
  
  // let elementBeingDisplayed = DISPLAY_CARD;
  const [onDisplay, setOnDisplay] = useState(DISPLAY_LIST);

  //  GRAPH TEMPLATES
  const graphTemplates = {
    colorSynergy: {
      wrapper: <section>
        <div>
          <canvas id="synergyGraph" width="800" height="400"></canvas>;
        </div>
      </section>
    },
    powerDistribution: {
      wrapper: <section>
        <div>
          <canvas id="powerGraphWhite" width="800" height="400"></canvas>;
          <canvas id="powerGraphBlue" width="800" height="400"></canvas>;
          <canvas id="powerGraphBlack" width="800" height="400"></canvas>;
          <canvas id="powerGraphRed" width="800" height="400"></canvas>;
          <canvas id="powerGraphGreen" width="800" height="400"></canvas>;
        </div>
      </section>
    },
    typeDistribution: {
      wrapper: <section>
        <div>
          <canvas id="typeGraphWhite" width="800" height="400"></canvas>;
          <canvas id="typeGraphBlue" width="800" height="400"></canvas>;
          <canvas id="typeGraphBlack" width="800" height="400"></canvas>;
          <canvas id="typeGraphRed" width="800" height="400"></canvas>;
          <canvas id="typeGraphGreen" width="800" height="400"></canvas>;
        </div>
      </section>
    }
  }
  const [currentGraphDisplay, setCurrentGraphDisplay] = useState(graphTemplates.colorSynergy.wrapper);


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
              <Image className="image" src={cardInfo.image_link_small}  />
            </div>
          </Tooltip>
        </div>
      });
    }
    else if(onDisplay === DISPLAY_CARD) {
      toDisplay = buildCardDisplay(selectedCard);
    }
    else if(onDisplay === DISPLAY_GRAPH) {
      toDisplay = currentGraphDisplay;
    }


    return toDisplay;
  }

  let closeCardDisplay = () => {
    setOnDisplay(DISPLAY_LIST);
  }

  let buildCardDisplay = (card) => {
    return (
    <div className="cardDisplay">
      <p className="textCloseCardDisplay" onClick={closeCardDisplay}>X</p>
      
      <h2 className="cardDisplayTitle">{card.name}</h2>
      <Image className="selectedCardImage" src={card.image_link} />
      <br />
      <p><b>Name</b>: {card.name}</p>
      <p><b>Type</b>: {card.type}</p>
      <br />

      {/* <p>{card.oracle_text}</p> */}
      {card.keywords.length === 0 ? '' : <p><b>Keywords</b>: {card.keywords.join(", ")}</p>}

      <br />
      {
        card.power === undefined ?
          ''
          :
          <p><b>Power</b>: {card.power}</p>
      }
      {
        card.toughness === undefined ?
          ''
          :
          <p><b>Toughness</b>: {card.toughness}</p>
      }
      {
        card.metrics === undefined ?
        ''
        :
        <div>
          <br />
          <p><b>Suggestions:</b></p>
          <p>{buildListSuggestion(card.metrics.more_power.equal_total_cost_and_colors)} more powerful cards. <Tooltip label="Higher power with same total mana cost">&#9432;</Tooltip></p>
          <p>{buildListSuggestion(card.metrics.more_toughness.equal_total_cost_and_colors)} tougher cards. <Tooltip label="Higher toughness with same total mana cost">&#9432;</Tooltip></p>
          <p>{buildListSuggestion(card.metrics.more_power_and_toughness.equal_total_cost_and_colors)} better cards. <Tooltip label="Higher power AND toughness with same total mana cost">&#9432;</Tooltip></p>
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

  const displayColorSynergyGraph = () => {
    console.log('ahoy!');
    setCurrentGraphDisplay(graphTemplates.colorSynergy.wrapper);
    setOnDisplay(DISPLAY_GRAPH);
    axios.get('http://localhost:8000/colors/compatibility')
      .then(response => {

        currentCharts.forEach(c => {console.log(c); c.destroy()} );

        let combinations = [];
        let cardsInCommon = [];
        Object.keys(response.data).forEach(entry => {
          combinations.push(entry);
          cardsInCommon.push(response.data[entry]);
        });

        const data = {
          labels: combinations,
          datasets: [{
            label: 'Cards in common',
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(255, 0, 0)',
            color: 'rgb(255, 0, 0)',
            data: cardsInCommon
          }]
        };

        const config = {
          type: 'bar',
          data: data,
          options: {
            plugins: {
              legend: {
                labels: {
                  color: 'white',
                  font: {
                    size: 18
                  }
                }
              }
            },
            scales: {
              y: {
                ticks: {
                  color: 'white'
                }
              },
              x: {
                ticks: {
                  color: 'white',
                  font: {
                    size: 18
                  }
                }
              }
            }
          }
        }

        const synergyChart = new Chart(
          document.getElementById('synergyGraph'),
          config
        );

        const newCharts = [synergyChart];
        setCurrentCharts(newCharts);

      });
  }

  const getColorName = (colorLetter) => {
    const COLORS = {
      'W': 'White',
      'U': 'Blue',
      'R': 'Red',
      'G': 'Green',
      'B': 'Black'
    }

    return COLORS[colorLetter];
  }

  const getColorRgb = (colorLetter) => {
    const COLORS = {
      'W': 'rgb(255, 255, 255)',
      'U': 'rgb(0, 0, 255)',
      'R': 'rgb(255, 0, 0)',
      'G': 'rgb(0, 255, 0)',
      'B': 'rgb(0, 0, 0)'
    }

    return COLORS[colorLetter];
  }

  const displayPowerDistributionGraph = () => {
    setCurrentGraphDisplay(graphTemplates.powerDistribution.wrapper);
    setOnDisplay(DISPLAY_GRAPH);
    axios.get('http://localhost:8000/colors/powerDistribution')
      .then(response => {

        currentCharts.forEach(c => {console.log(c); c.destroy()} );

        const newCharts = [];

        Object.keys(response.data).forEach(colorEntry => {
          const colorName = getColorName(colorEntry);
          
          let powers = [];
          let cardsPresent = [];
          response.data[colorEntry]['power'].forEach(powerEntry => {
            powers.push(powerEntry['power']);
            cardsPresent.push(powerEntry['totalCards']);
          });

          const data = {
            labels: powers,
            datasets: [{
              label: 'Power distribution in ' + colorName,
              backgroundColor: getColorRgb(colorEntry),
              borderColor: 'rgb(255, 0, 0)',
              color: 'rgb(255, 0, 0)',
              data: cardsPresent
            }]
          };

          const config = {
            type: 'bar',
            data: data,
            options: {
              plugins: {
                legend: {
                  labels: {
                    color: 'white',
                    font: {
                      size: 18
                    }
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    color: 'white'
                  }
                },
                x: {
                  ticks: {
                    color: 'white',
                    font: {
                      size: 18
                    }
                  }
                }
              }
            }
          };

          const curChart = new Chart(
            document.getElementById("powerGraph" + colorName),
            config
          );

          newCharts.push(curChart);

        });
        setCurrentCharts(newCharts);

      });
  }

  const displayTypeDistributionGraph = () => {
    setCurrentGraphDisplay(graphTemplates.typeDistribution.wrapper);
    setOnDisplay(DISPLAY_GRAPH);
    axios.get('http://localhost:8000/colors/typeDistribution?canon=y')
      .then(response => {

        currentCharts.forEach(c => {console.log(c); c.destroy()} );

        const newCharts = [];

        Object.keys(response.data).forEach(colorEntry => {
          const colorName = getColorName(colorEntry);
          
          let types = [];
          let cardsPresent = [];
          Object.keys(response.data[colorEntry]).forEach(typeEntry => {
            types.push(typeEntry);
            cardsPresent.push(response.data[colorEntry][typeEntry]);
          });

          const data = {
            labels: types,
            datasets: [{
              label: 'Type distribution in ' + colorName,
              backgroundColor: getColorRgb(colorEntry),
              borderColor: 'rgb(255, 0, 0)',
              color: 'rgb(255, 0, 0)',
              data: cardsPresent
            }]
          };

          const config = {
            type: 'bar',
            data: data,
            options: {
              plugins: {
                legend: {
                  labels: {
                    color: 'white',
                    font: {
                      size: 18
                    }
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    color: 'white'
                  }
                },
                x: {
                  ticks: {
                    color: 'white',
                    font: {
                      size: 18
                    }
                  }
                }
              }
            }
          };

          const curChart = new Chart(
            document.getElementById("typeGraph" + colorName),
            config
          );

          newCharts.push(curChart);

        });
        setCurrentCharts(newCharts);

      });
  }

  return (
    <ChakraProvider>
      <div className="main">
        <Heading paddingTop={'2rem'}>MTG Card Analysis</Heading>
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
                <Radio value='1'>Name</Radio>
                <Radio value='2'>Colors</Radio>
                <Radio value='3'>Keyword</Radio>
                <Radio value='4'>Power</Radio>
                <Radio value='5'>Toughness</Radio>
                <Radio value='6'>Above Average (color)</Radio>
                <Radio value='7'>Above Average (mana)</Radio>
                <Radio value='8'>Statistics</Radio>
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
            <p className="statsChoiceWrapper" hidden={radioValue !== '8'}>
              <button className="statsChoice" onClick={displayColorSynergyGraph}>Color synergy</button>
              <button className="statsChoice" onClick={displayPowerDistributionGraph}>Power distribution</button>
              <button className="statsChoice" onClick={displayTypeDistributionGraph}>Type distribution</button>
            </p>
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