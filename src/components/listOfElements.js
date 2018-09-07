import React from 'react';
import u from '../reactData';
import { connect } from 'react-redux';

const SelectWinProps = props => (
    <select id={`window-${props.type}-${props.tag}`} data-group={props.tag}
            data-type={props.type} className='form-control form-control-sm' onChange={props.handleChange}
            value={props.value}>
        <option hidden >{props.title}</option>
        {props.optionList}
    </select>
);

const InputWinProps = props => (
    <input id={`window-${props.type}-${props.tag}`} data-group={props.tag}
           data-type={props.type} className='form-control form-control-sm' type="number"
           value={props.value} placeholder={props.title} onChange={props.handleChange}
           min='0'/>
);

const nominalThickness = u.getNominalThickness().map(el =>
    <option key={el} value={el}>{el}</option>
);
const typeofGlass = u.getTypeofGlass().map(el =>
    <option key={el} value={el}>{el}</option>
);

const GenerateWindowForm = ( vidrio={}, key='', removeItem, handleChange ) => {
    const deleteItem = typeof removeItem === 'function' ?
        <div className="remove-item"
            onClick={() => removeItem(key)}> &times;
        </div> : null;

    return (
    <div key={key.toString()} className='form-group list-of-elements'>
        {deleteItem}
        <div className='form-row'>
            <div className='col'>
                <small><strong>ALTO:</strong></small>
                <InputWinProps tag={key} value={vidrio.height} type='height' title='height' handleChange={handleChange}/>
            </div>
            <div className='col'>
                <small><strong>ANCHO:</strong></small>
                <InputWinProps tag={key} value={vidrio.width} type='width' title='width' handleChange={handleChange}/>
            </div>
            <div className='col'>
                <small><strong>ORIENTACIÓN:</strong></small>
                <SelectWinProps tag={key} value={vidrio.orientacion} type='orientacion' handleChange={handleChange} title='Orientación'
                    optionList={[
                        <option key='N' value='N'>N</option>,
                        <option key='S' value='S'>S</option>,
                        <option key='E' value='E'>E</option>,
                        <option key='W' value='W'>W</option>,
                    ]} />
            </div>
        </div>
        <div className='form-row'>
            <div className='col'>
                <small><strong>SOMBRA:</strong></small>
                <SelectWinProps
                    tag={key} value={vidrio.sombra}
                    type='sombra'
                    handleChange={handleChange}
                    title='Sombra'
                    optionList={[
                        <option key='yes' value='yes'>Yes</option>,
                        <option key='no' value='no'>No</option>
                    ]}/>
            </div>
            <div className='col'>
                <small><strong>ESPESOR NOMINAL:</strong></small>
                <SelectWinProps
                    tag={key}
                    value={vidrio.espesor_nominal}
                    type='espesor_nominal'
                    handleChange={handleChange}
                    title='Espesor nominal'
                    optionList={nominalThickness}/>
            </div>
            <div className='col'>
                <small><strong>TIPO DE VIDRIO:</strong></small>
                <SelectWinProps
                    tag={key}
                    value={vidrio.tipo_de_vidrio}
                    type='tipo_de_vidrio'
                    handleChange={handleChange}
                    title='Tipo de vidrio'
                    optionList={typeofGlass}/>
            </div>
        </div>
    </div>
    );
}

class NewGlassForm extends React.Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            width: '', height: '', orientacion: '', sombra: '', espesor_nominal: '', tipo_de_vidrio:''
        };
        this.state = this.defaultState;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const el = event.target;
        const type = el.dataset.type
        this.setState({[type]: el.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.submit(this.state)
        this.setState(this.defaultState);
    }

    render() {
        const blankForm = GenerateWindowForm(this.state, 4, undefined, this.handleChange);
        return (
            <form onSubmit={this.handleSubmit}>
                { blankForm }
                <div className="add-window-button">
                    <button type="submit" className="btn btn-outline-primary">Agregar ventana</button>
                </div>
            </form>
        );
    }
}



export const ListOfElements = ({vidrios, removeItem, handleChange, handleAddButton, handleBackButton}) => {
    const inputList = vidrios.map( (vidrio, key) => (
        GenerateWindowForm(vidrio, key, removeItem, handleChange)
    ));

    return (
        <div>
            <div>
                <button type="button"
                        className="btn btn-outline-dark btn-sm list-back-button"
                        onClick={handleBackButton}>
                        <strong>&#8592;</strong>
                </button>
            </div>
            <small><strong>PROPIEDADES DE LAS VENTANAS:</strong></small>
            { inputList }
            <NewGlassForm submit={handleAddButton}/>
        </div>
    );
}

const mapStateToProps = state => ({
    vidrios: state.vidrios
});

const mapDispatchToProps = dispatch => ({
    handleChange: event => {
        const el = event.target;
        const id = Number(el.dataset.group);
        const type = el.dataset.type

        dispatch({
            type: 'UPDATE_PROP_VIDRIO',
            data: { id, [type]: el.value }
        });
        dispatch({
            type: 'CALC_AREA_VIDRIO',
            id
        });
    },
    handleAddButton: data => dispatch({
        type: 'ADD_VIDRIO',
        data
    }),
    removeItem: key => dispatch({
        type: 'REMOVE_VIDRIO',
        key
    }),
    handleBackButton: () => dispatch({
        type: 'HIDE_WINDOWS_PROPS'
    })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListOfElements);
