import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const TagPicker = ({load, loadx, tags, selectedTag, setSelectedTag}) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);   

    useEffect(() => {

        const merged = [...new Set([{tag: 'Add a new Tag', color: 'white'},...tags])];
        const TagList = [...new Set(merged.map(c=>c.tag))];
        const merged2 = () => {
            const tags= []
            for(var i=0; i< TagList.length; i++){
                tags.push({tag: TagList[i]})
            }
            return tags
        }
        let newArray=merged2().map((item) => {
            return {label: item.tag, value: item.tag}})
        setItems(newArray)
        setSelectedTag(value)
    }, [load]);
    

    return (
        <>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={()=>(loadx(!load),setOpen(!open))}
                setValue={setValue}
                onSelectItem={()=>(loadx(!load))}
                dropDownDirection="TOP"
            />
        </>
    );
};

const styles = StyleSheet.create({

});

export default TagPicker;
