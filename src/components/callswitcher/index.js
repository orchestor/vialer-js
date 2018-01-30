module.exports = (app) => {

    return {
        computed: app.utils.sharedComputed(),
        methods: {
            classes: function(call, block) {
                let classes = {}
                if (block === 'icon') {
                    classes.active = call.active
                    if (call.hold) classes['icon-hold'] = true
                    else classes['icon-phone'] = true
                }
                return classes
            },
            setActiveCall: function(call) {
                app.emit('bg:sip:call_activate', {callId: call.id})
            },
        },
        render: templates.callswitcher.r,
        staticRenderFns: templates.callswitcher.s,
        store: {
            calls: 'sip.calls',
        },
    }
}
