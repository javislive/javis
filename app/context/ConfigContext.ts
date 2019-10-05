import {contextForState} from 'react-febrest';
import state from 'state';

const context = contextForState(state.config);
export default context;
