<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\AvailabilityDates;
use Database\Factories\UserFactory;
use Database\Factories\AvailabilityDatesFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

class CalendarTest extends TestCase
{
    public function testUserDatesAvailable()
    {
        //create a fake user.
        $user = UserFactory::new()->create([
            'name' => $this->faker->firstName,
            'email' => $this->faker->email,
        ]);

        //put a fake date as available
        $dates = AvailabilityDatesFactory::new()->create([
            'user_id' => $user->id,
            'date' => $this->faker->date,
            'available' => 1,
        ]);

        // Call API with parametrs
        $response = $this->json('POST', '/api/availability', [
            'user_id' => $user->id,
        ]);

        // Assert
        $response->assertStatus(200);
        $response->assertExactJson([
            [
                'date' => $dates->date,
            ],
        ]);
    }

    public function testStoreDatePassed()
    {
        //create a fake user.
        $user = UserFactory::new()->create([
            'name' => $this->faker->firstName,
            'email' => $this->faker->email,
        ]);

        // $dates = AvailabilityDatesFactory::new()->create([
        //     'user_id' => $user->id,
        //     'date' => '2023-02-28',
        //     'available' => 1,
        // ]);
        $requestData = [
            'user_id' => $user->id,
            'date' => $this->faker->date,
        ];

        // Call API with parametrs
        $response = $this->json('POST', '/api/availability/date', $requestData);

        // Assert
        $response->assertStatus(200);
        $response->assertExactJson([
            'status' => 'success',
        ]);
    }

    public function testStoreDateFailed()
    {
        //create a fake user.
        $user = UserFactory::new()->create([
            'name' => 'John',
            'email' => 'john.doe@gmail.com',
        ]);

        $dates = AvailabilityDatesFactory::new()->create([
            'user_id' => $user->id,
            'date' => '2023-02-28',
            'available' => 1,
        ]);
        $requestData = [
            'user_id' => $user->id,
            'date' => '2023-02-28',
        ];

        // Call API with parametrs
        $response = $this->json('POST', '/api/availability/date', $requestData);

        // Assert
        $response->assertStatus(200);
        $response->assertExactJson([
            'status' => 'already exists that date.',
        ]);
    }

    public function testDestroyDatePassed()
    {
        //create a fake user.
        $user = UserFactory::new()->create([
            'name' => $this->faker->firstName,
            'email' => $this->faker->email,
        ]);

        $dates = AvailabilityDatesFactory::new()->create([
            'user_id' => $user->id,
            'date' => $this->faker->date,
            'available' => 1,
        ]);
        $requestData = [
            'user_id' => $user->id,
            'date' => $dates->date,
        ];

        // Call API with parametrs
        $response = $this->json(
            'POST',
            '/api/availability/delete/date',
            $requestData
        );

        // Assert
        $response->assertExactJson([
            'status' => 'deleted',
        ]);
        $this->assertDatabaseMissing('availability_dates', $requestData);
    }

    public function testDestroyDateFailed()
    {
        //create a fake user.
        $user = UserFactory::new()->create([
            'name' => 'Mary',
            'email' => 'mary.doe@gmail.com',
        ]);

        $dates = AvailabilityDatesFactory::new()->create([
            'user_id' => $user->id,
            'date' => '2023-02-27',
            'available' => 1,
        ]);
        $requestData = [
            'user_id' => $user->id + 1,
            'date' => $dates->date,
        ];

        // Call API with parametrs
        $response = $this->json(
            'POST',
            '/api/availability/delete/date',
            $requestData
        );

        // Assert
        $response->assertExactJson([
            'status' => 'Doesnt exist that date into db',
        ]);
        $this->assertDatabaseMissing('availability_dates', $requestData);
    }
}
