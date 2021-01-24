$('body').on('mouseover mouseenter', '.tooltipA', function(){
     $(this).tooltipster({
        content: 'This is often the best indicator of how badly affected an area is, in-comparison to other areas. Higher number means that there is a greater ratio of cases to area population.',
        animation: 'grow',
        position: 'bottom',
        maxWidth: '280'

     });
     $(this).tooltipster('show');
});
$('body').on('mouseover mouseenter', '.tooltipB', function(){
     $(this).tooltipster({
        content: 'Total number of people who had a positive test result for COVID-19 in this area and died within 28 days of the first positive test.',
        animation: 'grow',
        position: 'bottom',
        maxWidth: '280'

     });
     $(this).tooltipster('show');
});
$('body').on('mouseover mouseenter', '.tooltipC', function(){
     $(this).tooltipster({
        content: 'Total number of people who had a positive test result for COVID-19 in this area and died within 28 days of the first positive test per 100k population of this region.',
        animation: 'grow',
        position: 'bottom',
        maxWidth: '280'

     });
     $(this).tooltipster('show');
});
