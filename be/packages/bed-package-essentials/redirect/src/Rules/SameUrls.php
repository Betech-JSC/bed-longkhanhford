<?php

namespace JamstackVietnam\Redirect\Rules;

use Illuminate\Contracts\Validation\Rule;

class SameUrls implements Rule
{
    public function __construct()
    {
    }

    public function passes($attribute, $value)
    {
        return !trim(strtolower($this->old_url), '/') == trim(strtolower($this->new_url), '/');
    }

    public function message()
    {
        return 'The old url cannot be the same as the new url!';
    }
}
