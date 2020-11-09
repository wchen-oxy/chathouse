import React from 'react';
import ShortPostViewer from "../../post/viewer/short-post";
import LongPostViewer from "../../post/viewer/long-post";
import AxiosHelper from '../../../Axios/axios';

const MAIN = "MAIN";
const SHORT = "SHORT";


class EventModal extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            window: MAIN,
            largeViewMode: false,
            // loaded: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
    
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        if (!this.props.eventData || !this.props.textData) return (<></>);
        if (this.state.window === MAIN) {
            return (this.props.eventData.post_format === SHORT ?

                    <ShortPostViewer
                        // loaded={this.state.loaded}
                        textData={this.props.textData}
                        largeViewMode={this.state.largeViewMode}
                        isOwnProfile={this.props.isOwnProfile}
                        eventData={this.props.eventData}
                        onDeletePost={this.props.onDeletePost} />

                :
                <div className="long-post-window">
                    <LongPostViewer
                        // username={this.props.username}
                        // loaded={this.state.loaded}
                        textData={this.props.textData}
                        isOwnProfile={this.props.isOwnProfile}
                        eventData={this.props.eventData}
                        onDeletePost={this.props.onDeletePost} />
                </div>
            );

        }
        else {
            return (
                <div>

                </div>
            )
        }
    }
}

export default EventModal;