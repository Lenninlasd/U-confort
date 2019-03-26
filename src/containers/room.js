import { connect } from 'react-redux';
import {
  setDepth,
  setHeight,
  setWidth,
  calcAreaPiso,
  calcAreaTecho,
  setNumberOfPeople,
  setNumberOfLights,
  setActividadRecinto,
  setTipoRecinto
} from '../actions';
import { RoomForm } from '../components/RoomConfig';

const actionSizeForm = target => {
  const value = Number(target.value);
  switch (target.id) {
    case 'depth':
      return setDepth(value);
    case 'width':
      return setWidth(value);
    case 'height':
      return setHeight(value);
  }
};

const actionEnclosure = ({ value, id }) => {
  switch (id) {
    case 'actividadRecinto':
      return setActividadRecinto(value);
    case 'numberOfPeople':
      return setNumberOfPeople(Number(value));
    case 'numberOfLights':
      return setNumberOfLights(Number(value));
    case 'tipoRecinto':
      return setTipoRecinto(value);
  }
};

const mapStateToProps = state => ({
  width: state.width,
  height: state.height,
  depth: state.depth,
  actividadRecinto: state.recinto.actividad_recinto,
  tipoRecinto: state.recinto.tipo_recinto,
  numberOfPeople: state.numberOfPeople,
  numberOfLights: state.luces.numberOfLights
});

const mapDispatchToProps = dispatch => ({
  onSizeChange: event => {
    dispatch(actionSizeForm(event.target));
    dispatch(calcAreaPiso());
    dispatch(calcAreaTecho());
  },
  onEnclosureChange: event => dispatch(actionEnclosure(event.target))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomForm);