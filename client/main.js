/**
 * Created by Dulitha RD on 11/6/2016.
 */
import '../imports/ui/youtubevideoaddfrom.js';
import '../imports/ui/youtubevideoviewcomponent.js';
import '../imports/ui/heartbutton/heartbutton';
import '../imports/ui/youtubevideoupdate/youtubevideoupdateform.js';
import '../imports/ui/singlepoststatsview/singlepoststatview.js';
import '../imports/ui/featuredvideotile/featuredvideotile.js';
import '../imports/ui/article/articleaddform.js';
import '../imports/ui/article/articleviewcomponent.js';
import '../imports/ui/confirmation_dialog/postdeleteconfirmbox.js';
import '../imports/ui/report_dialog/recipereportdialogbox.js';


Meteor.startup(function () {
    sAlert.config({
        effect: '',
        position: 'bottom-right',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 80, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });

    if (Meteor.isClient) {
        return SEO.config({
            title: 'The Ambula - Sri Lankan Culinary Network',
            meta: {
                'description': "'The Ambula' intend to serve as a much needed platform for Sri Lankan culinary enthusiasts to gain knowledge on both traditional and modern Sri Lankan cuisine and various food products."
            },
            og: {
                'image': 'http://www.theambula.lk/images/icons/apple-icon-180x180.png' 
           }
        });
    }

});
