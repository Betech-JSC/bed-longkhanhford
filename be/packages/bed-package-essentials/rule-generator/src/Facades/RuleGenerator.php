<?php

namespace JamstackVietnam\RuleGenerator\Facades;

use Illuminate\Support\Facades\Facade;
use JamstackVietnam\RuleGenerator\Services\Generator;

class RuleGenerator extends Facade
{

    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return Generator::class;
    }
}
