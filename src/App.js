import { React, useState } from "react";
import { Input, Button, Stack, Checkbox, ChakraProvider, CheckboxGroup } from '@chakra-ui/react';
import "./App.css";

function App() {
  const [inputText, setInputText] = useState(""); 
  const [checkedItems, setCheckedItems] = React.useState([false, false])
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
          <CheckboxGroup colorScheme='teal' defaultValue={[]}>
            <Stack spacing={[1, 5]} direction={['column', 'row']}>
              <Checkbox isChecked={checkedItems[0]} onChange={(e) => {setCheckedItems([e.target.checked, false, false, false, false])}}>Card Name</Checkbox>
              <Checkbox isChecked={checkedItems[1]} onChange={(e) => {setCheckedItems([false, e.target.checked, false, false, false])}}>Card colors</Checkbox>
              <Checkbox isChecked={checkedItems[2]} onChange={(e) => {setCheckedItems([false, false, e.target.checked, false, false])}}>Keywords</Checkbox>
              <Checkbox isChecked={checkedItems[3]} onChange={(e) => {setCheckedItems([false, false, false, e.target.checked, false])}}>Power</Checkbox>
              <Checkbox isChecked={checkedItems[4]} onChange={(e) => {setCheckedItems([false, false, false, false, e.target.checked])}}>Toughness </Checkbox>
            </Stack>
          </CheckboxGroup>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;