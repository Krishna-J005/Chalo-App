import {
    RoutePropertiesMap, validationCheck, RoutePropertiesSet, FieldHeader, FlexContainer, FormGroup, FormLabel,
    FlexRowContainer, FormInput, SingleSelect,
} from './style'
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {
    Formik,
    Form,
    FieldArray,
} from 'formik'
import Button from '@material-ui/core/Button';
import { useState, useEffect, useCallback } from 'react';

const getRouteValue = () => {
    const storyVal = {}
    Object.keys(RoutePropertiesSet).map((val) => {
        storyVal[val] = {}
        RoutePropertiesSet[val].forEach(item => prepareData(item, val, storyVal))
    })
    return storyVal;
}
const prepareData = (item, val, offerVal) => {
    if (!offerVal[val]) offerVal[val] = {}
    else if (item.type === 'subChildren') return offerVal[val][item.key] = [
        {
            id: '',
            name: '',
            latitude: '',
            longitude: ''
        },
        {
            id: '',
            name: '',
            latitude: '',
            longitude: ''
        }
    ];
    else if (item.type === 'number') return offerVal[val][item.key] = '';
    else return offerVal[val][item.key] = ''
}
const RouteProperty = (props) => {
    const param = useParams()
    const navigate = useNavigate()
    // console.log(param,props,"ppppppppppppp")
    const [formValues, setFormValues] = useState(null)
    const [validatedAll, setValidatedAll] = useState(null)
    // const [options, setOptions] = useState([])
    const [pending, setPending] = useState(true);
    const [data,setData] = useState([])
    const validationSchemaCheck = useCallback(() => {
        return (setValidatedAll({ ...validationCheck }))
    }, [])



    useEffect(() => {
        validationSchemaCheck()
    }, [])

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('data'))
        console.log(localData)
        setData(localData)
        if (!formValues && !props.editData) {
            setFormValues(getRouteValue())
            validationSchemaCheck()
        }
        else if (!formValues && props.editData) {
            
            const val = localData.filter((curr,ind) =>{
                return curr.routeId === param.routeId
             })
            const route = {...val[0]}

            setFormValues({ ...formValues, route })
            validationSchemaCheck()
        }
        setPending(false)
    }, [])

    

    const getDerivedHtml = (item, itemName, index, formObj) => {
        let name = '', values = '', error = '', showError = ''
        return (
            <>
                <div style={{ width: "100%" }}>
                    <FieldHeader style={{ width: '100%' }}>{item.label}</FieldHeader>
                    <FieldArray name='subComponent' render={arrayhelpers => (
                        formObj?.values?.[itemName]?.[item['key']] ?
                            formObj?.values?.[itemName]?.[item['key']].map((val, ind) => {
                                return (
                                    <FlexRowContainer>{
                                        item.children.map((child, i) => {
                                            name = `${itemName}.${item['key']}[${ind}][${child.key}]`
                                            error = formObj?.errors[itemName]?.[item.key]?.[ind]?.[child.key]
                                            values = formObj.values[itemName]?.[item.key]?.[ind]?.[child.key]
                                            showError = error === 'Required' && formObj.touched?.[itemName]?.[item.key]?.[ind]?.[child.key]
                                            return (
                                                <>
                                                    <FormGroup>
                                                        <FormLabel required={item.validation[0] === 'required'}>{child.label}</FormLabel>
                                                        <FormInput type={child.type} medium name={name}
                                                            value={values}
                                                            onBlur={(e) =>{
                                                                if(item.type === 'text') formObj.setFieldValue(name, e.target.value.trim()) 
                                                                formObj.handleBlur(e)}}
                                                            onChange={(e) => {
                                                                formObj.setFieldValue(e.target.name, e.target.value)
                                                            }}>
                                                        </FormInput>
                                                        {showError && (<div style={{ color: 'red', marginTop: '.5rem' }}>{error}</div>)}
                                                    </FormGroup>
                                                    {item.children.length - 1 === i && formObj.values[itemName]?.[item.key].length > 2 && <DeleteOutlineIcon style={{ cursor: 'pointer', color: 'red', marginTop: '2.8rem' }} onClick={(e) => deleteListRow(e, item, itemName, formObj, ind)} />
                                                    }
                                                </>)
                                        })

                                    }
                                    </FlexRowContainer>)
                            }) : null)
                    }
                    />
                    <Button variant="contained" color="secondary" onClick={(e) => { addInfo(e, item, itemName, formObj) }}
                        style={{ margin: '10px', padding: '10px 15px', width: '20%' }}>
                        {
                            formObj?.values?.[itemName]?.[item['key']]?.length === 0 ?
                                "Add Source"
                                :
                                "Add Stop"
                        }
                    </Button>
                </div>
            </>
        )
    }



    const addInfo = (e, item, itemName, formObj) => {
        formObj.values?.[itemName]?.[item['key']]?.push({
            id: '',
            name: '',
            latitude: '',
            longitude: ''
        })
        setFormValues({ ...formObj?.values })
    }

    const deleteListRow = (e, item, itemName, formObj, ind) => {
        e.preventDefault();
        formObj?.values?.[itemName]?.[item.key].splice(ind, 1);
        setFormValues({ ...formObj?.values })

    }

    const getDerivedInputHtml = (item, itemName, index, formObj) => {
        let name = `${itemName}.${item.key}`
        let values = `${formObj.values?.[itemName]?.[item.key]}`
        let error = formObj.errors?.[itemName]?.[item['key']]
        let showError = error && (error === 'Required' || error.length > 0) && formObj.touched?.[itemName]?.[item['key']]

        return (
            <FormGroup>
                <FormLabel required={item.validation[0] === 'required'}>{item.label}</FormLabel>
                <FormInput type={item.type} medium name={name}
                    value={values}
                    disabled={props.editData && item.key === 'routeId'}
                    onBlur={(e) =>{ 
                        if(item.type === 'text') formObj.setFieldValue(name, e.target.value.trim()) 
                        formObj.handleBlur(e)
                    }}
                    onChange={(e) => formObj.setFieldValue(name, e.target.value)}
                ></FormInput>
                {showError && (<div style={{ color: 'red', marginTop: '.5rem' }}>{error}</div>)}
            </FormGroup>
        )
    }

    const handleSubmit = async (e, formObj, formik) => {
        formik.validateForm().then(err => {
            if (Object.keys(err)?.length > 0 && Object.keys(err?.route)?.length > 0) {
                formik.setTouched({ ...formik.touched, ...err });
                return;
            } else {
                routeSubmit(e, formObj, formik)
            }
        })
    }

    const routeSubmit = async (e, formObj, formik) => {
        e.preventDefault();
        setPending(true)
        let payload = { ...formObj.route }

        console.log(payload)
        if (props.editData) {
            try {
                const filterData = data.filter(curr => curr.routeId !== param.routeId)
                setData([...filterData,payload])
                localStorage.setItem('data',JSON.stringify([...filterData,payload]));
                setFormValues({ ...formObj })
                setPending(false)
                navigate('/')
            }
            catch (err) {
                console.log("erroMessage", err)
                setPending(false);
            }
        }
        else {
            try {
                setData([...data,payload])
                localStorage.setItem('data',JSON.stringify([...data,payload]));
                console.log("HandleSubmit response")
                navigate('/')
                setPending(false);
            }
            catch (err) {
                console.log("erroMessage", err)
                setPending(false);
            }
        }
    }

    const getDerivedSelectHtml = (item, itemName, index, formObj) => {
        let name = `${itemName}.${item.key}`
        let values = formObj?.values?.[itemName]?.[item['key']]
        let error = formObj?.errors?.[itemName]?.[item.key]
        let showError = error && error.length > 0 && formObj.touched?.[itemName]?.[item['key']]

        return (
            <FormGroup>
                <FormLabel required={item.validation[0] === 'required'}>{item.label}</FormLabel>
                <SingleSelect
                    name={name}
                    value={values}
                    onChange={(e, value) => {
                        formObj.setFieldValue(name, e.target.value)
                    }
                    }
                    onBlur={(e) => { formObj.handleBlur(e) }}
                    key={index}
                    id={`select_${item.key}`}
                    required
                >
                    <option value="" disabled >Select {item.label}</option>
                    {item.key === 'status' ?
                        <>
                            <option value={'Active'}>Active</option>
                            <option value={'Inactive'}>Inactive</option>
                        </>
                        :
                        <>
                            <option value={'Up'}>Up</option>
                            <option value={'Down'}>Down</option>
                        </>

                    }
                </SingleSelect>
                {showError && (<div style={{ color: 'red', marginTop: '.5rem' }}>{error}</div>)}
            </FormGroup>
        )
    }

    const createFormHtml = (item, index, formik, itemName) => {
        if (item.type === 'text' || item.type === 'number')
            return getDerivedInputHtml(item, itemName, index, formik)
        else if (item.type === 'select')
            return getDerivedSelectHtml(item, itemName, index, formik)
        else if (item.type === 'subChildren')
            return getDerivedHtml(item, itemName, index, formik)
    }
    return (
        <>
            {
                !pending ?
                    <Formik
                        initialValues={formValues || getRouteValue()}
                        validationSchema={Yup.object(validatedAll)}
                        enableReinitialize
                    >
                        {
                            formik => {
                                console.log("Formik", formik)
                                return (
                                    <Form>
                                        {Object.keys(RoutePropertiesSet).map((item, index) => {
                                            return (
                                                <>
                                                    <FieldHeader>{RoutePropertiesMap[item]}</FieldHeader>
                                                    <FlexContainer key={`coupon${index}`}>
                                                        {
                                                            RoutePropertiesSet[item].map((items, ind) => {
                                                                return createFormHtml(items, ind, formik, item)
                                                            })
                                                        }
                                                    </FlexContainer>
                                                </>
                                            )
                                        })
                                        }
                                        {(<><div style={{ display: 'flex', justifyContent: 'end' }}>
                                            {(Object.keys(formik.errors).length > 0 && Object.keys(formik.touched).length > 0) && <div style={{ color: 'red', margin: '.5rem', fontWeight: 'bold' }}>Required field are Missing</div>}
                                        </div>
                                            <div style={{ display: 'flex', justifyContent: 'end' }}>

                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    variant="contained"
                                                    style={{ margin: '10px', padding: '10px 15px', width: '15%' }}
                                                    onClick={(e) => { handleSubmit(e, formik.values, formik) }}
                                                >
                                                    Submit
                                                </Button>
                                            </div> </>)}
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                    : null
            }
        </>
    )
}

export default RouteProperty;