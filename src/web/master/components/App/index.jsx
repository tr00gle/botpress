import React, {Component} from 'react'
import axios from 'axios'
import {
  Provider,
  connect,
  nuclearMixin
} from 'nuclear-js-react-addons'

import EventBus from '~/util/EventBus'
import routes from '../Routes'

import reactor from '~/reactor'
import ModulesStore from '~/stores/ModulesStore'
import NotificationsStore from '~/stores/NotificationsStore'
import actions from '~/actions'

export default class App extends Component {

  constructor(props) {
    super(props)

    reactor.registerStores({
      'modules': ModulesStore,
      'notifications': NotificationsStore
    })

    this.state = { events: EventBus.default }
    EventBus.default.setup() // TODO remove that once auth is done
  }

  componentDidMount() {
    // This acts as the app lifecycle management.
    // If this grows too much, move to a dedicated lifecycle manager.
    actions.fetchModules()
    actions.fetchNotifications()

    EventBus.default.on('notifications.all', (notifications) => {
      actions.replaceNotifications(notifications)
    })

    EventBus.default.on('notifications.new', (notification) => {
      actions.addNotifications([ notification ])
    })
  }

  render() {
    // const el = React.cloneElement(this.props.children, {
    //   skin: this.props.route.skin,
    //   modules: modules
    // })
    return <Provider reactor={reactor}>
      {routes()}
    </Provider>
  }
}
