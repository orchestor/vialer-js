module.exports = (app) => {
    const keyTone = new app.sounds.DtmfTone(350, 440)
    const allowedKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '*', '#']

    // we detect the mouseup event on the window tag as opposed to the li
    // tag because otherwise if we release the mouse when not over a button,
    // the tone will remain playing.
    $(window).on('mouseup touchend', function() {
        if (keyTone.status) {
            window.setTimeout(() => {
                keyTone.stop()
            }, 50)
        }
    })

    return {
        methods: {
            dial: function() {
                if (!this.number) return
                app.emit('bg:sip:call', {number: this.number})
            },
            inputChange: function(newVal) {
                this.$emit('update:model', newVal)
            },
            pressKey: function(key) {
                if (!allowedKeys.includes(key)) return
                keyTone.play(key)
                // this.number = `${this.number}${key}`
                this.$emit('update:model', `${this.number}${key}`)
                if (this.call) app.emit('bg:sip:dtmf', {callId: this.call.id, key})
            },
            removeLastNumber: function() {
                this.$emit('update:model', this.number.substring(0, this.number.length - 1))
            },
            transferNumber: function() {
                app.emit('bg:sip:transfer', {callId: this.call.id, number: this.number})
            },
            unpressKey: function() {
                window.setTimeout(() => {
                    keyTone.stop()
                }, 50)

            },
        },
        props: {
            call: {default: null},
            dense: {
                default: false,
                type: Boolean,
            },
            dtmf: {
                default: false,
                type: Boolean,
            },
            number: {default: ''},
        },
        render: templates.keypad.r,
        staticRenderFns: templates.keypad.s,
        watch: {
            number: function(newVal, oldVal) {
                if (isNaN(newVal)) {
                    this.$emit('update:model', oldVal)
                }
            },
        },
    }
}
