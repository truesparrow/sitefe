import * as React from 'react'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { Event } from '@truesparrow/content-sdk-js'

import * as config from './config'
import * as commonText from './common.text'
import { HomePage } from './home-page'
import { NotFoundPage } from './not-found-page'
import * as services from './services'
import { subEventPage } from './subevent-page'
import { EventState, OpState, StatePart } from './store'

import * as text from './app-frame.text'


export interface Props {
    location: Location;
    isPreloaded: boolean;
    isLoading: boolean;
    isReady: boolean;
    isFailedAndMissing: boolean;
    isFailed: boolean;
    event: Event | null;
    errorMessage: string | null;
    onEventLoading: () => void;
    onEventReady: (event: Event) => void;
    onEventFailedAndMissing: () => void;
    onEventFailed: (errorMessage: string) => void;
}

export interface State {
    carouselPreviousImage: number;
    carouselCurrentImage: number;
}

class _AppFrame extends React.Component<Props, State> {
    // Needs to be in sync with .slidein and .slideout stiles.
    private static readonly _CAROUSEL_INTERVAL_MS = 3000;

    private _carouselTimerId: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            carouselPreviousImage: 0,
            carouselCurrentImage: props.isPreloaded || props.isReady ? (props.event as Event).pictureSet.pictures.length - 1 : -1
        };
        this._carouselTimerId = 0;
    }

    async componentDidMount() {
        // If it's preloaded or already failed and missing at the mount point then the server did
        // all the work.
        if (this.props.isPreloaded || this.props.isFailedAndMissing) {
            const __this = this;

            this._carouselTimerId = window.setInterval(() => {
                const newCarouselCurrentImage = (this.state.carouselCurrentImage + 1) % (__this as any).props.event.pictureSet.pictures.length;
                this.setState({
                    carouselPreviousImage: this.state.carouselCurrentImage,
                    carouselCurrentImage: newCarouselCurrentImage
                });
            }, _AppFrame._CAROUSEL_INTERVAL_MS);
            return;
        }

        this.props.onEventLoading();

        try {
            const event = await services.CONTENT_PUBLIC_CLIENT().getEventBySubDomain(config.SUBDOMAIN);
            this.props.onEventReady(event);

            const __this = this;

            this._carouselTimerId = window.setInterval(() => {
                const newCarouselCurrentImage = (this.state.carouselCurrentImage + 1) % (__this as any).props.event.pictureSet.pictures.length;
                this.setState({
                    carouselPreviousImage: this.state.carouselCurrentImage,
                    carouselCurrentImage: newCarouselCurrentImage
                });
            }, _AppFrame._CAROUSEL_INTERVAL_MS);
        } catch (e) {
            if (e.name == 'EventNotFoundError') {
                this.props.onEventFailedAndMissing();
            } else {
                console.log(e);
                services.ROLLBAR_CLIENT().error(e);
                this.props.onEventFailed('Could not load event for user');
            }
        }
    }

    componentWillUnmount() {
        if (this._carouselTimerId > 0) {
            window.clearInterval(this._carouselTimerId);
        }
    }

    render() {
        const helmet =
            <Helmet>
                <title>{text.pageTitle[config.LANG()]}</title>
            </Helmet>;

        if (this.props.isLoading) {
            return (
                <div className="loading">
                    {helmet}
                    <span className="message">{commonText.loading[config.LANG()]}</span>
                </div>
            );
        } else if (this.props.isFailedAndMissing) {
            return <NotFoundPage />;
        } else if (this.props.isFailed) {
            return (
                <div className="failed">
                    {helmet}
                    <span className="message">{commonText.loadingFailed[config.LANG()]}</span>
                </div>
            );
        } else {
            const event = this.props.event as Event;

            const pictures = event.pictureSet.pictures.map(picture => {
                const extraClass =
                    (picture.position == this.state.carouselCurrentImage + 1) ? 'slidein' :
                        (picture.position == this.state.carouselPreviousImage + 1) ? 'slideout' : '';

                return (
                    <img
                        key={picture.position}
                        className={'app-frame-carousel-image ' + extraClass}
                        src={picture.mainImage.uri}
                        width={picture.mainImage.width}
                        height={picture.mainImage.height} />
                );
            });

            const subEventNavLinks = event.subEventDetails
                .filter(subEvent => subEvent.haveEvent)
                .map(subEvent => {
                    return (
                        <NavLink
                            key={subEvent.slug}
                            to={`/${subEvent.slug}`} exact>
                            {subEvent.title[config.LANG()]}
                        </NavLink>
                    );
                });

            const subRoutes = event.subEventDetails
                .filter(subEvent => subEvent.haveEvent)
                .map(subEvent => {
                    return (
                        <Route
                            key={subEvent.slug}
                            exact
                            path={`/${subEvent.slug}`}
                            component={subEventPage(subEvent)} />
                    );
                });

            return (
                <div className="app-frame">
                    <div className="app-frame-carousel">
                        {pictures}
                    </div>
                    <div className="app-frame-content">
                        <header>
                            <NavLink to="/" exact>{text.home[config.LANG()]}</NavLink>
                            {subEventNavLinks}
                        </header>
                        <main>
                            <Switch>
                                <Route exact path="/" component={HomePage} />
                                {subRoutes}
                                <Route path="*" component={NotFoundPage} />
                            </Switch>
                        </main>
                    </div>
                </div>
            );
        }
    }
}


function stateToProps(state: any) {
    return {
        isPreloaded: state.event.type == OpState.Preloaded,
        isLoading: state.event.type == OpState.Init || state.event.type == OpState.Loading,
        isReady: state.event.type == OpState.Ready,
        isFailedAndMissing: state.event.type == OpState.Failed && state.event.eventIsMissing,
        isFailed: state.event.type == OpState.Failed,
        event: state.event.type == OpState.Ready || state.event.type == OpState.Preloaded ? state.event.event : null,
        errorMessage: state.event.type == OpState.Failed ? state.event.errorMessage : null
    };
}


function dispatchToProps(dispatch: (newState: EventState) => void) {
    return {
        onEventLoading: () => dispatch({ part: StatePart.Event, type: OpState.Loading }),
        onEventReady: (event: Event) => dispatch({ part: StatePart.Event, type: OpState.Ready, event }),
        onEventFailedAndMissing: () => dispatch({ part: StatePart.Event, type: OpState.Failed, eventIsMissing: true, errorMessage: 'Event is missing' }),
        onEventFailed: (errorMessage: string) => dispatch({ part: StatePart.Event, type: OpState.Failed, eventIsMissing: false, errorMessage })
    };
}


export const AppFrame = withRouter(connect(stateToProps, dispatchToProps)(_AppFrame as any));
