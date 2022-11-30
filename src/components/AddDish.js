import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, InputGroup, HTMLSelect } from '@blueprintjs/core';
import NavBarUser from './NavBarUser';
import MenuBar from './MenuBar';
import axios from 'axios';
import '../styles/addDish.css';

export default function AddDish() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('')
    const [time, setTime] = useState('')
    const [calorie, setCalorie] = useState('')
    const [availability, setAvailability] = useState('')
    const [file1, setFile] = useState('')
    const [fileName, setFileName] = useState('');

    const history = useHistory();
    useEffect(() => {
        const dishValue = history.location.state ? history.location.state.data : {};
        setName(dishValue.foodName);
        setDesc(dishValue.foodDescription);
        setType(dishValue.foodClass);
        setPrice(dishValue.price);
        setCalorie(dishValue.calorie);
        setTime(dishValue.preparationTime);
        setAvailability(dishValue.available ? 'availability' : 'non-availability')
    }, [history.location.state && history.location.state.data]);

    const sub = () => {
        const val = {
            foodName: name,
            foodDescription: desc,
            calorie: calorie,
            price: price,
            preparationTime: time,
            foodClass: type,
            available: availability === 'availability' ? true : false,
            picName: fileName,
        };
        
        if (history.location && history.location.state && Object.keys(history.location.state.data).length === 0 || !history.location.state) {
            axios.post('http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/foods', val).then((res) => {
                history.push('/menu')
            });
        }
        else {
            const dishValue = history.location.state ? history.location.state.data : {};
            axios.put(`http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/foods/${dishValue.foodId}`, val).then((res) => {
                history.push('/menu')
            });
        }
    };

    const fileUpload = () => {
        const formData = new FormData();
        formData.append("file", file1);
        axios.post('http://canteenservice-env.eba-2mxfbgby.eu-west-2.elasticbeanstalk.com/rest/v1/upload', formData).then((res) => {
            setFileName(res.data)
        });
      }
    

    const changeHandler = (event) => {
        setFile(event.target.files[0]);
    };


    return (
        <div style={{ height: '100%' }}>
            <NavBarUser view={true} />
            <div style={{ display: 'flex', height: '100%' }}>
                <MenuBar view={true} />
                <div className='addDishWrapper'>
                    <label
                        className="addDishHeader">
                        {history.location && history.location.state && Object.keys(history.location.state.data).length === 0 || !history.location.state ?
                        'Add Dish' : 'Edit Dish'}
                    </label>
                    <div className='addDishFieldWrapper'>
                        <label className="addDishFieldLabel">Dish name : </label>
                        <InputGroup
                            className="inputField"
                            placeholder="Enter name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='addDishFieldWrapper'>
                        <label className="addDishFieldLabel">Description : </label>
                        <InputGroup
                            className="inputField"
                            placeholder="Enter description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                    <div className='addDishFieldWrapper'>
                        <label className="addDishFieldLabel">Type : </label>
                        <HTMLSelect
                            name="item_select"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option> Select Type</option>
                            <option value="VEG"
                                selected={(history.location.state && history.location.state.data || {}).foodClass === 'VEG'}>VEG</option>
                            <option value="NON-VEG"
                                selected={(history.location.state && history.location.state.data || {}).foodClass === 'NON-VEG'}>NON-VEG</option>
                        </HTMLSelect>
                    </div>
                    <div className='addDishFieldWrapper'>
                        <label className="addDishFieldLabel" >Price : </label>
                        <InputGroup
                            className="inputField"
                            placeholder="Enter Price"
                            name="price"
                            onChange={(e) => setPrice(e.target.value)}
                            type="number"
                            value={price}
                        />
                    </div>
                    <div className='addDishFieldWrapper'>
                        <label className="addDishFieldLabel" >Calorie : </label>
                        <InputGroup
                            className="inputField"
                            placeholder="Enter Calorie"
                            name="calorie"
                            onChange={(e) => setCalorie(e.target.value)}
                            type="number"
                            value={calorie}
                        />
                    </div>
                    <div className='addDishFieldWrapper'>
                        <label className="addDishFieldLabel">Preparation Time : </label>
                        <InputGroup
                            className="inputField"
                            placeholder="Enter Preparation Time"
                            name="time"
                            onChange={(e) => setTime(e.target.value)}
                            type="number"
                            value={time}
                        />
                    </div>

                    <div className='addDishFieldWrapper'>
                        <label className="addDishFieldLabel">Availability : </label>
                        <HTMLSelect
                            name="item_select"
                            onChange={(e) => setAvailability(e.target.value)}
                        >
                            <option> Select Availability</option>
                            <option value="availability" selected={(history.location.state && history.location.state.data || {}).available}>Availability</option>
                            <option value="non-availability" selected={!((history.location.state && history.location.state.data || {}).available)}>Not Availability</option>
                        </HTMLSelect>
                    </div>
                    <div className='addDishFileWrapper'>
                        Select image to upload:
                        <input type="file" name="fileToUpload" id="fileToUpload" onChange={changeHandler} accept="image/*" />
                        <input type="submit" value="Upload" name="submit" onClick={() => fileUpload('fileToUpload')}/>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button
                            className="submitBtn bp3-intent-success addDishButtonWrapper"
                            type="submit"
                            onClick={() => { history.push("/menu") }}
                        >
                            Cancel
                        </Button>

                        <Button
                            className="submitBtn bp3-intent-success addDishButtonWrapper"
                            type="submit"
                            onClick={sub}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
