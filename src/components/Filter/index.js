import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './style.js';
import { Formik, Form, Field, } from 'formik';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FilterListIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
const theme = createMuiTheme({
    palette: {
        secondary: {
            light: "#F5B041",
            main: "#F39C12",
        }
    }
});

const Filter = (props) => {
    const { classes } = props
    const [filter, setFilter] = useState({
        name: '',
        routeId: '',
        status: [],
        direction: []
    })
    const [timer, setTimer] = useState(false)
    const initialValues = {
        name: '',
        routeId: '',
        status: 'all',
        direction: 'all'
    }
    const handleFilterChange = (fieldName, fieldValue, values) => {
        let updatedValues = {
            ...values,
            [fieldName]: fieldValue
        }
        props.handleFilterChange(updatedValues)
    }

    const handleResetChange = (e, formik) => {
        setTimer(true)
        formik.handleReset(e)
        setTimeout(() => setTimer(false), 1000)
        props.handleResetChange();
    }

    useEffect( () => {
        try {
            setFilter({
                ...filter,
                status : ['Active','Inactive'],
                direction : ['Up','Down']
            })

        } catch (err) {
            console.log(err)
        }
    }, [])

    return (
        <Formik
            initialValues={initialValues}
        >
            {formik => {
                console.log('Formik props', formik)

                return (
                    <Form>
                        <fieldset style={{ width: '100%',display: 'flex',flexDirection: 'row',flexWrap: 'wrap',marginBottom: '1.0rem', paddingBottom: '1.0rem', border: "0px none", borderTop: "1px solid #b7ede0" ,borderBottom: "1px solid #b7ede0", }}>
                            <legend style={{color: '#72C29B',fontWeight:'bold',fontSize:20}}>Route Filter</legend>
                        <div className={classes.formContainer}>
                            <div className={classes.chaloContainer}>
                                <FilterListIcon className={classes.filterIcon} />
                            </div>
                            <div className={classes.chaloContainer}>
                                <div className={classes.header}>RouteId</div>
                                <Input
                                    className={classes.inputField}
                                    type="text"
                                    onChange={(e) => {
                                        formik.setFieldValue('routeId', e.target.value)
                                        handleFilterChange('routeId', e.target.value, formik.values)
                                    }}
                                    value={formik.values.routeId}
                                    placeholder="RouteId"
                                />

                            </div>
                            <div className={classes.chaloContainer}>
                                <div className={classes.header}>Route Name</div>
                                <Input
                                    className={classes.inputField}
                                    type="text"
                                    onChange={(e) => {
                                        formik.setFieldValue('name', e.target.value)
                                        handleFilterChange('name', e.target.value, formik.values)
                                    }}
                                    value={formik.values.name}
                                    placeholder="Enter route name"
                                />
                            </div>
                            
                            <div className={classes.chaloContainer}>
                                <div className={classes.header}>Status</div>
                                <Select className={classes.inputSelect}

                                    value={formik.values.status}
                                    onChange={(e) => {
                                        formik.setFieldValue('status', e.target.value)
                                        handleFilterChange('status', e.target.value , formik.values)
                                    }}
                                >
                                    <MenuItem value={"all"}>All</MenuItem>
                                    {filter?.status.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </div>
                            <div className={classes.chaloContainer}>
                                <div className={classes.header}>Direction</div>
                                <Select className={classes.inputSelect}
                                    
                                    value={formik.values.direction}
                                    onChange={(e) => {
                                        formik.setFieldValue('direction', e.target.value)
                                        handleFilterChange('direction', e.target.value, formik.values)
                                    }}
                                >
                                    <MenuItem value={'all'}>All</MenuItem>
                                    {filter?.direction.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </div>
                            <div className={classes.chaloContainer}>
                                <MuiThemeProvider theme={theme}>
                                    <Button variant="contained"
                                        color="secondary"
                                        className={classes.resetButton}
                                        disabled={timer}
                                        onClick={(e) => {
                                            handleResetChange(e, formik)
                                        }}>Reset</Button>
                                </MuiThemeProvider>
                            </div>
                        </div>
                        </fieldset>
                    </Form>)
            }}
        </Formik>
    )

}

export default withStyles(styles)(Filter);
