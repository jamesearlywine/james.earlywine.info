/* globals angular, $, heredoc */

/**
 * History Service 
 */
 angular.module('BubblesService', [])
    .factory('BubblesService', [
        '$sce',
        function(
            $sce
        )
        {
            var api = {
                bubbles : {},
                otherBubbles : {},
                init: function() {
                    this.bubbles = {
                        1 : {
                            turnNumber: 1,
                            type: 'turn',
                            markerLabel: '1',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn1.jpg'),
                            /* photo: $sce.trustAsResourceUrl(''), */
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>At the start, you may have to rub your eyes 
                                at the sight of the Indy cars zooming up the 
                                famous front straightaway in the opposite direction 
                                of the Indy 500. But then make sure your eyes are 
                                wide open when the field hits Turn 1 for the beginning 
                                of the infield course. The race to Turn 1 is about late 
                                braking and battling for the most prized real estate on 
                                any road course - the first spot into Turn 2.</p>
                            */}))
                        },
                        2 : {
                            turnNumber: 2,
                            type: 'turn',
                            markerLabel: '2',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn2.jpg'),
                            /*video: $sce.trustAsResourceUrl('https://www.youtube.com/embed/GRbNqXHbXZ4?rel=0&showinfo=0'),*/
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>How do the drivers approach Turn 2? Depends on
                                how they hit Turn 1. That first righthander goes
                                into a quick change-of-direction lefthander. "Your
                                line on the entry of the first corner dictates what's
                                going to happen on the exit off 2, so you have to be
                                really tidy there," inaugural Angie's List Grand Prix of
                                Indianapolis champion Simon Pagenaud says.</p>
                            */}))
                        },
                        3 : {
                            turnNumber: 3,
                            type: 'turn',
                            markerLabel: '3',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn3.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>If you're in the Northwest Vista, you'll enjoy
                                close views of the action here as the drivers rev
                                their Honda and Chevrolet engines to full throttle
                                again after the tap dance of Turns 1 and 2. But just
                                as quickly as they're on the gas, another challenging
                                piece of the track awaits.</p>
                            */}))
                        },
                        4 : {
                            turnNumber: 4,
                            type: 'turn',
                            markerLabel: '4',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn4.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>This section of the course is so tricky that
                                Verizon IndyCar Series ace Scott Dixon spun
                                during the inaugural race in 2014, yet also one
                                that 2015 winner Will Power calls "a cool corner."
                                The rear end of the car is "very on edge" going
                                into the turn, Power explains, which means this
                                part of the course has their full attention.</p>
                            */}))
                        },
                        5 : {
                            turnNumber: 5,
                            type: 'turn',
                            markerLabel: '5',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn5.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>2015 winner Will Power sees this chicane as a "flat-out"
                                section provided you use the curbs, and what fan doesn't
                                like to see Indy cars bounce over those? If you're
                                on the spectator mounds off Turn 6, at the north end of
                                Hulman Boulevard, the cars will appear to be coming right
                                at you before heading south for the second-longest straight
                                of the course.</p>
                            */}))
                        },
                        6 : {
                            turnNumber: 6,
                            type: 'turn',
                            markerLabel: '6',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn6.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>2015 winner Will Power sees this chicane as a "flat-out"
                                section provided you use the curbs, and what fan doesn't
                                like to see Indy cars bounce over those? If you're
                                on the spectator mounds off Turn 6, at the north end of
                                Hulman Boulevard, the cars will appear to be coming right
                                at you before heading south for the second-longest straight
                                of the course.</p>
                            */}))
                        },
                        7 : {
                            turnNumber: 7,
                            type: 'turn',
                            markerLabel: '7',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn7.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>After the fast dash south down Hulman Boulevard lies a
                                prime passing area for drivers who can time their brake
                                just right and cut the corner. Spectator mounds and a grandstand
                                are in this area and are terrific spots to watch the jockeying
                                for positions into the second half of the road course. "I notice
                                the mounds on the parade laps," 2015 champion Will Power says.
                                "What a great setup for the track."</p>
                            */}))
                        },
                        8 : {
                            turnNumber: 8,
                            type: 'turn',
                            markerLabel: '8',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn8-10.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>This small section is a chicane where drivers flick the wheel
                                one way (right) then the other (left), then bear into a right
                                turn at 10. "This is all connected," Simon Pagenaud explains.
                                "Whatever you do in the first corner, it's going to dictate
                                how fast you do or don't get to the last corner. You want to
                                be really smooth." Fans can judge drivers' smoothness for
                                themselves from mounds just north of the section, where 2015
                                champ Will Power says he'd be watching if he was a fan.</p>
                            */}))
                        },
                        9 : {
                            turnNumber: 9,
                            type: 'turn',
                            markerLabel: '9',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn8-10.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>This small section is a chicane where drivers flick the wheel
                                one way (right) then the other (left), then bear into a right
                                turn at 10. "This is all connected," Simon Pagenaud explains.
                                "Whatever you do in the first corner, it's going to dictate
                                how fast you do or don't get to the last corner. You want to
                                be really smooth." Fans can judge drivers' smoothness for
                                themselves from mounds just north of the section, where 2015
                                champ Will Power says he'd be watching if he was a fan.</p>
                            */}))
                        },
                        10 : {
                            turnNumber: 10,
                            type: 'turn',
                            markerLabel: '10',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn8-10.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>This small section is a chicane where drivers flick the wheel
                                one way (right) then the other (left), then bear into a right
                                turn at 10. "This is all connected," Simon Pagenaud explains.
                                "Whatever you do in the first corner, it's going to dictate
                                how fast you do or don't get to the last corner. You want to
                                be really smooth." Fans can judge drivers' smoothness for
                                themselves from mounds just north of the section, where 2015
                                champ Will Power says he'd be watching if he was a fan.</p>
                            */}))
                        },
                        11 : {
                            turnNumber: 11,
                            type: 'turn',
                            markerLabel: '11',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn11.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>On Memorial Day weekend, this is one of the four famous
                                sweeping left turns on the 2.5-mile oval. On the road course,
                                however, this is where drivers bear down for the longest
                                right turn of the 2.439-mile layout. The spectator mounds
                                just southeast of the museum are an excellent spot to hear
                                the cars speed into the last few turns of the course.</p>
                            */}))
                        },
                        12 : {
                            turnNumber: 12,
                            type: 'turn',
                            markerLabel: '12',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn12.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>After cruising through Turn 11 into the south short chute,
                                a hard-braking zone awaits to make the 90-degree Turn 12.
                                "This is a tough corner because you're braking on some banking
                                (on the oval), and you come down off the banking onto the road
                                course," 2015 champion Will Power says. Fans in the South Vista
                                grandstand will be right on top of this key passing zone.</p>
                            */}))
                        },
                        13 : {
                            turnNumber: 13,
                            type: 'turn',
                            markerLabel: '13',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn13.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>In order hit maximum speed on the famed front straightaway,
                                drivers have to navigate this hard left turn without losing
                                too much momentum. Will Power, a winner last year, calls it
                                one of the most important corners on the course for just that
                                reason. Fans in the Southwest Vista and E stand will have 82
                                laps of action to judge how well drivers get through this part.</p>
                            */}))
                        },
                        14 : {
                            turnNumber: 14,
                            type: 'turn',
                            markerLabel: '14',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/turn14.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p>The final turn of the road course sweeps through the infield
                                onto the front straightaway. Will your favorite driver be
                                leading here? Lurking to make a pass for the lead? Fans in the
                                Paddock, Stand A and Stand B can see for themselves.</p>
                            */}))
                        },
                        15 : {
                            turnNumber: 15,
                            type: 'other',
                            markerLabel: 'A',
                            title: 'Autograph Session',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/ad-autograph.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p class="bold">FRIDAY, MAY 13</p>
                                <p>Bring your friends and family to get up close and
                                personal to some of the fastest drivers in the world.
                                Maybe you'll meet your favorite driver or find a new one.
                                Be sure to bring your memorabilia and have it signed.
                                Friday, May 13 at 1:00 pm in the INDYCAR Fan Village.</p>

                            */}))
                        },
                        16 : {
                            turnNumber: 16,
                            type: 'other',
                            markerLabel: 'B',
                            title: 'Bronze Badge Grid Walk*',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/ad-bronze.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p class="bold">GET UP CLOSE TO THE ACTION ON SATURDAY, MAY 14.</p>
                                <p>Witness the pre-race excitement with a walk through the pits.
                                Don't miss your chance to see drivers, cars and pit crews before
                                the race begins! Visit ims.com/bronzebadge today.
                                Must be 18 years or older.</p>
                                <p>*Opportunity limited to Bronze Badge holders only.</p>
                            */}))
                        },
                        17 : {
                            turnNumber: 17,
                            type: 'other',
                            markerLabel: 'C',
                            title: 'This is IndyCar',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/ad-personal.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p class="bold">UP CLOSE AND PERSONAL</p>
                                <p>The Angie's List&reg; Grand Prix of Indianapolis&reg; is back. With
                                infield viewing mounds, an autograph session, and free
                                garage tours, it's a whole new way to experience IMS in May.</p>
                            */}))
                        },
                        18 : {
                            turnNumber: 18,
                            type: 'other',
                            markerLabel: 'G',
                            title: 'Free Garage Friday*',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/ad-garage.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p class="bold">FRIDAY, MAY 13, STARTING AT 8:30 A.M.</p>
                                <p>Step inside a Verizon IndyCar Series garage and see what
                                it takes to keep world-class cars and drivers running.
                                Garage experiences are available all day after gates open.
                                Must be 18 years or older.</p>
                                <p>*Visit IMS.com for more details, timing and age restrictions.</p>
                            */}))
                        },
                        19 : {
                            turnNumber: 19,
                            type: 'other',
                            markerLabel: 'K',
                            title: 'Kids Free*',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/ad-kids.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p class="bold">12 AND UNDER GET IN FREE!</p>
                                <p>Bring your kids and your friends' kids to this family-friendly
                                race. All children 12 and under are free with a paid adult
                                general admission ticket. Get ready to load up the car.</p>
                                <p>*Not valid on reserved seats.</p>
                            */}))
                        },
                        20 : {
                            turnNumber: 20,
                            type: 'other',
                            markerLabel: 'T',
                            title: 'Track Invasion',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/ad-invasion.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p class="bold">WALK WHERE THE PROS RACE!</p>
                                <p>After the race, storm the iconic racetrack with your
                                fellow race fans. It's your chance to kick the marbles
                                and kiss the bricks for a photo of a lifetime. Buy your
                                tickets before prices increase on April 16th!</p>
                            */}))
                        },
                        21 : {
                            turnNumber: 21,
                            type: 'other',
                            markerLabel: 'T',
                            title: 'Track Invasion',
                            display: false,
                            position: 'auto',
                            photo: $sce.trustAsResourceUrl('common/img/gallery/ad-invasion.jpg'),
                            video: $sce.trustAsResourceUrl(''),
                            text: $sce.trustAsHtml(heredoc(function() {/*
                                <p class="bold">WALK WHERE THE PROS RACE!</p>
                                <p>After the race, storm the iconic racetrack with your
                                fellow race fans. It's your chance to kick the marbles
                                and kiss the bricks for a photo of a lifetime. Buy your
                                tickets before prices increase on April 16th!</p>
                            */}))
                        }
                    };
                } // end init
            }; // end api
    
            api.init();
            return api;

            
        } // end function
        
    ]) // end factory
    
; // end module
        