<?php

namespace JamstackVietnam\Contact\Rules;

use Illuminate\Contracts\Validation\Rule;

class Blackwords implements Rule
{

    protected $blackwords;

    public function __construct()
    {
        $this->blackwords = ['0977626065', '0316311107', 'Money Forward', 'lừa đảo', 'FLAME', 'NGOC NGUYEN', '@jamstackvietnam.com', 'jamstack vietnam'];
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $isNotValid = false;

        foreach ($this->blackwords as $blackword) {
            if (is_string($value) && strpos(strtolower($value), strtolower($blackword)) !== false) {
                $isNotValid = true;
                break;
            }
        }
        return !$isNotValid;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The validation error message.';
    }
}
