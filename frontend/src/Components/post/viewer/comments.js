import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import AxiosHelper from '../../../Axios/axios';
import SingleComment from "./sub-components/single-comment";
import CommentInput from "./sub-components/comment-input";
import {SHORT, EXPANDED, COLLAPSED, RECENT_POSTS } from "../../constants/flags";

import "./comments.scss";

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            windowType: this.props.windowType,
            currentComments: null,
            commentText: "",
            loadingComments: true,


        }
        this.renderCommentSectionType = this.renderCommentSectionType.bind(this);
        this.renderCommentInput = this.renderCommentInput.bind(this);
        this.renderCommentThreads = this.renderCommentThreads.bind(this);
        this.recursiveRenderComments = this.recursiveRenderComments.bind(this);

        this.handleCommentTextChange = this.handleCommentTextChange.bind(this);
        this.handleCommentPost = this.handleCommentPost.bind(this);
        this.handleAnnotation = this.handleAnnotation.bind(this);
    }

    componentDidMount() {
        if (this.props.comments.length > 0) {

            AxiosHelper.getComments({
                params: {
                    visitorUsername: this.props.visitorUsername,
                    rootCommentIdArray: JSON.stringify(this.props.comments),
                    viewingMode: this.state.windowType
                }
            })
                .then(
                    (result) => {
                        this.setState({
                            visitorProfilePreviewId: result.data.userPreviewId,
                            loadingComments: false,
                            currentComments: result.data.rootComments
                        }, () => {
                            if (this.props.postType === SHORT) this.props.onGeneratedAnnotations(result.data.rootComments)
                        });


                    }
                )
        }
        else {
            AxiosHelper.getUserPreviewId({ params: { username: this.props.visitorUsername } })
                .then((result) => {
                    this.setState({
                        visitorProfilePreviewId: result.data.userPreviewId,
                        loadingComments: false,
                        currentComments: []
                    });
                })
        }
    }

    handleCommentTextChange(text) {
        this.setState({ commentText: text })
    }

    handleCommentPost() {
        let payload = {
            visitorProfilePreviewId: this.state.visitorProfilePreviewId,
            comment: this.state.commentText,
            postId: this.props.postId,
            imagePageNumber: 0
        };

        return AxiosHelper
            .postComment(payload)
            .then(
                (result) => {
                    return AxiosHelper
                        .refreshComments({ params: { rootCommentIdArray: JSON.stringify(result.data.rootCommentIdArray) } })
                        .then((result) => {
                            this.props.handleCommentInjection(this.props.postIndex, result.data.rootComments, this.props.selectedPostFeedType);
                            this.setState({ currentComments: result.data.rootComments });
                        }
                        )
                })
            .then(() => alert("Success!"))

    }

    renderCommentSectionType(viewingMode) {
        if (this.state.loadingComments) {
            return <div>
                Loading...
            </div>
        }

        if (viewingMode === COLLAPSED) {
            return (
                this.renderCommentThreads(this.state.currentComments)
            )
        }
        else if (viewingMode === EXPANDED) {
            return (
                this.renderCommentThreads(this.state.currentComments)
            )
        }
        else {
            throw new Error("No viewing modes matched");
        }
    }

    recursiveRenderComments(commentData, level) {
        const currentLevel = level + 1;
        const annotation = commentData.annotation ? JSON.parse(commentData.annotation) : null;
        if (!commentData.replies) {
            return (
                <SingleComment
                    level={currentLevel}
                    postId={this.props.postId}
                    visitorProfilePreviewId={this.state.visitorProfilePreviewId}
                    commentId={commentData._id}
                    ancestors={commentData.ancestor_post_ids}
                    username={commentData.username}
                    commentText={commentData.comment}
                    likes={commentData.likes}
                    dislikes={commentData.dislikes}
                    displayPhoto={commentData.display_photo_key}
                    score={commentData.score}

                    annotation={annotation}
                    onMouseOver={this.props.onMouseOver}
                    onMouseOut={this.props.onMouseOut}
                />
            );
        }
        else {
            let replies = [];
            commentData.replies.sort(
                (a, b) => {
                    if (a.createdAt < b.createdAt) {
                        return -1;
                    }
                    if (a.createdAt > b.createdAt) {
                        return 1;
                    }
                    return 0;
                });
            for (const reply of commentData.replies) {
                replies.push(this.recursiveRenderComments(reply, currentLevel));
            }
            return (
                <div>
                    <SingleComment
                        level={currentLevel}
                        postId={this.props.postId}
                        visitorProfilePreviewId={this.state.visitorProfilePreviewId}
                        visitorUsername={this.props.visitorUsername}
                        commentId={commentData._id}
                        ancestors={commentData.ancestor_post_ids}
                        username={commentData.username}
                        commentText={commentData.comment}
                        score={commentData.score}
                        likes={commentData.likes}
                        dislikes={commentData.dislikes}
                        displayPhoto={commentData.display_photo_key}

                        annotation={annotation}
                        onMouseOver={this.props.onMouseOver}
                        onMouseOut={this.props.onMouseOut}
                    />
                    <div className="comments-reply-container">
                        {replies}
                    </div>
                </div>
            )
        }
    }


    renderCommentThreads(rawComments) {
        let renderedCommentArray = [];
        for (const rootComment of rawComments) {
            renderedCommentArray.push(
                this.recursiveRenderComments(rootComment, 0)
            );
        }
        return renderedCommentArray;
    }

    renderCommentInput(viewingMode) {
        if (this.props.visitorUsername) {
            return (
                <div className={viewingMode === COLLAPSED ?
                    "comments-collapsed-input-container" : "comments-expanded-input-container"}>
                    <CommentInput
                        classStyle={viewingMode === COLLAPSED ?
                            "comments-collapsed-input" : "comments-expanded-input"}
                        minRows={4}
                        handleTextChange={this.handleCommentTextChange}
                        commentText={this.state.commentText}
                    />
                    <div>
                        <button onClick={this.handleCommentPost}>Add Comment</button>
                        <button onClick={this.handleAnnotation}>Annotate</button>
                    </div>

                </div>
            );
        }
        else {
            return (
                <div>
                    <p>You must sign in before you can leave a comment.</p>
                </div>
            )
        }
    }

    handleAnnotation() {

    }

    render() {
        if (this.state.windowType === COLLAPSED) {
            return (
                <div className="comments-main-container">
                    {this.renderCommentSectionType(COLLAPSED)}
                    {this.renderCommentInput(COLLAPSED)}
                    {/* {this.state.currentComments} */}
                </div>
            );
        }
        else if (this.state.windowType === EXPANDED) {
            return (
                <div className="comments-main-container">
                    {this.renderCommentInput(EXPANDED)}
                    {this.renderCommentSectionType(EXPANDED)}
                    {/* {this.state.currentComments} */}

                </div>
            )
        }

    }
}
export default Comments;