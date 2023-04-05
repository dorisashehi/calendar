<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Faker\Factory;
use Faker\Generator;
use Illuminate\Support\Facades\Artisan;
abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    private Generator $faker;

    public function setUp(): void
    {
        parent::setUp();
        $this->faker = Factory::create();
        Artisan::call('migrate:refresh');
    }

    public function __get($key)
    {
        if ($key === 'faker') {
            return $this->faker;
        }
        throw new Exception('Unknown Key Requested');
    }
}
