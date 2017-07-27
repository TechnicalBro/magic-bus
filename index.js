/**
 * @type Channel
 */
export class Channel {
  constructor (name, ...listeners) {
    this.name = name
    this.listeners = [...listeners]
  }

  handle (event) {
    if (event.name !== this.name) {
      return
    }

    for (let listener of this.listeners) {
      listener(event)
    }
  }
}

/**
 * Extremely simple EventBus which enforces good habits through threating bugs otherwise ^_^.
 * @type EventBus
 */
export class EventBus {
  _subscriptions = []

  /**
   *Initialize an instance of the EventBus
   * @param {array} subscriptions array of Channel objects (or literals) to configure the eventbus with.
   */
  constructor (...subscriptions) {
    this._subscriptions = [...subscriptions].map((channel) => {
      let _channel = channel
      if (!(_channel instanceof Channel)) {
        _channel = new Channel(channel.name, [...channel.listeners])
      }

      return _channel
    })
  }

  /**
   * Emit an event and payload to be received by all those listening.
   * @param name - event to emit.
   * @param payload - payload to pass to listeners.
   */
  emit (name, payload) {
    this._subscriptions.filter(channel => channel.name === name).forEach(channel => {
      channel.listeners.forEach(payload)
    })
  };

  /**
   * Register an event listener.
   * @param name
   * @param listener
   */
  on (name, listener) {
    let _channel

    // Checks whether or not we have a channel created in our subscriptions for this event
    // and if we don't, then we create a channel for the event and push it up, otherwise, we add a listener to the
    // existing channel.

    if (!this.channelExists(name)) {
      _channel = new Channel(name, [listener])
      this._subscriptions.push(_channel)

      return
    }

    _channel = this.getChannel(name)
    _channel.listener.push(listener)
  };

  /**
   * Get an Event Channel by its given name if it exists.
   * @param name - event name to get channel for.
   * @returns {Channel} - Channel in the event-bus with the given name.
   */
  getChannel (name) {
    return this._subscriptions.find(channel => channel.name === name)
  };

  /**
   * Check the existence of a Channel by its name.
   * @param name - event name to check channels for.
   * @returns {boolean} - true if it exists, false otherwise.
   */
  channelExists (name) {
    return this._subscriptions.find(channel => channel.name === name) !== undefined
  };
}

export const bus = new EventBus()
