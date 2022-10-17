import styled from "styled-components"
import * as Yup from 'yup'

export const Route_Properties = [{
    label: 'Route Id',
    type: 'text',
    html: 'input',
    placeholder: 'Route Id',
    key: 'routeId',
    validation: ['required']
}, {
    label: 'Name',
    type: 'text',
    html: 'input',
    placeholder: 'Enter name',
    key: 'name',
    validation: ['required']
}, {
    label: 'Status',
    type: 'select',
    html: 'input',
    key: 'status',
    validation: ['required']
}, {
    label: 'Direction',
    type: 'select',
    html: 'input',
    key: 'direction',
    validation: ['required']
}, {
    label: 'Mobile No.',
    type: 'number',
    html: 'input',
    placeholder: 'Enter your mobile number',
    key: 'mobile',
    validation: ['required']
}, {
  label: 'Stop List',
  type: 'subChildren',
  html: 'input',
  key: 'stopList',
  validation: ['required'],
  children: [{
    label: 'Stop ID',
    type: 'text',
    html: 'input',
    key: 'id',
    validation: ['required']
  }, {
    label: 'Stop Name',
    type: 'text',
    html: 'input',
    key: 'name',
    validation: ['required']
  },{
    label: 'Latitude',
    type: 'number',
    html: 'input',
    key: 'latitude',
    validation: ['required']
  },{
    label: 'Longitude',
    type: 'number',
    html: 'input',
    key: 'longitude',
    validation: ['required']
  }]
}]

export const FlexContainer = styled.div`
   display:flex;
   flex-wrap: wrap;
`
export const FieldHeader = styled.div`
   
    padding: 0px 10px;
    font-size: 20px;
    margin-top: 10px;
    font-weight: bold;
`


export const FormLabel = styled.label`
    width: 100%;
    margin-bottom: 5px;
    font-size: 0.8rem;
    color: #666;
    font-weight: bold;
    text-align: left;
    ${props => {
        if (props.required) return `
      ::after {
        content: "*";
        color: red;
        font-size: 12px;}
      `
    }}
`
export const SingleSelect =styled.select`
      display: inline-block;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 16px;
      width: 250px;
      height: 42px;
      &:invalid {
        color: #666666;
      }
      option:first-child{
        color: #cccccc;
      }
      option:not(:first-child){
        color: black;
        background: white;
      }
`   
export const FormGroup = styled.div`
  display:flex;
  flex-direction:column;
  margin:10px 16px;
`
export const FlexRowContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`
export const FormInput = styled.input.attrs(props => ({
    type: props.type,
    size: props.medium ? 8 : undefined,
    min: props.type === 'number' ? 0 : undefined
}))`
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    width: 250px;
    height: 42px;
    border: 1px solid rgb(204, 204, 204);
    display: block;
    ::placeholder {
      color: rgb(204, 204, 204);
    }
  `

export const validationSchema = () => {
    let validate = {};
    const validateAll = {}
    Object.keys(RoutePropertiesSet).forEach((val) => {
        RoutePropertiesSet[val].forEach(item => {
            if (item.type === 'number' && item.key === 'mobile' && item.validation.includes('required')) {
                validate[item.key] = Yup.string().matches(/^[6-9][0-9]{9}$/, 'Phone number is not valid').required('Required')
            }
            else if ((item.type === 'text' || item.type ==='select') && item.validation.includes('required')) {
                validate[item.key] = Yup.string().trim().nullable(true).required('Required')
            }
            else if(item.type === 'subChildren' && item.validation.includes('required')){
                validate[item.key] = Yup.lazy(val => Yup.array()
                          .of(
                            Yup.object().shape({
                              id: Yup.string().trim().nullable(false).required('Required'),
                              name: Yup.string().trim().nullable(false).required('Required'),
                              latitude:  Yup.number().required('Required'),
                              longitude: Yup.number().required('Required')
                          })
                ))
            }
        })
        validateAll[val] = Yup.object(validate)
        validate = {}
    })
    return validateAll
}

export const RoutePropertiesMap = {
    route: 'Route Properties'
}

export const RoutePropertiesSet = {
    route: Route_Properties
}

export const validationCheck = validationSchema();