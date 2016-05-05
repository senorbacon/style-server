var i=0;

setInterval(function() 
{
    process.stdout.write(i + "\n");
    if (i++ >= 15) {
        process.exit();
    }
}, 1000);
