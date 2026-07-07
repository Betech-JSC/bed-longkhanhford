<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaintenanceSchedule;

class MaintenanceScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // Truncate existing data to start clean
        MaintenanceSchedule::truncate();

        $schedules = [
            [
                'title' => 'Fiesta',
                'image' => ['path' => 'uploads/car-fiesta.png'],
                'links' => [
                    ['label' => 'Fiesta 2011 - 2013', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20%26%20Maintainance/maintenance-schedule-plan/Fiesta-2011-2013.pdf'],
                    ['label' => 'Fiesta 2013 - 2018', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Fiesta-2013-nay.pdf'],
                ],
                'sort_order' => 1,
                'status' => 'ACTIVE'
            ],
            [
                'title' => 'Focus',
                'image' => ['path' => 'uploads/car-focus.png'],
                'links' => [
                    ['label' => 'Focus 2005 - 2012', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Focus-2005-2012.pdf'],
                    ['label' => 'Focus 2012 - 2015', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Focus%202012-2015.pdf'],
                    ['label' => 'Focus 2015 - 2019', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Focus-2015.pdf'],
                ],
                'sort_order' => 2,
                'status' => 'ACTIVE'
            ],
            [
                'title' => 'Ecosport',
                'image' => ['path' => 'uploads/car-ecosport.png'],
                'links' => [
                    ['label' => 'EcoSport 2014 - 2018', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/EcoSport-2014-2018.pdf'],
                    ['label' => 'EcoSport 2018 - nay', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/EcoSport-2018.pdf'],
                ],
                'sort_order' => 3,
                'status' => 'ACTIVE'
            ],
            [
                'title' => 'Everest',
                'image' => ['path' => 'uploads/car-everest.png'],
                'links' => [
                    ['label' => 'Everest 2009 - 2015', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Everest-2009-2015.pdf'],
                    ['label' => 'Everest 2016', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Everest-2016.pdf'],
                    ['label' => 'Everest 2018', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/everest-2018.pdf'],
                ],
                'sort_order' => 4,
                'status' => 'ACTIVE'
            ],
            [
                'title' => 'Ranger',
                'image' => ['path' => 'uploads/car-ranger.png'],
                'links' => [
                    ['label' => 'Ranger 2012 - 2015', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Ranger-2012-2015.pdf'],
                    ['label' => 'Ranger 2016', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Ranger-2016.pdf'],
                ],
                'sort_order' => 5,
                'status' => 'ACTIVE'
            ],
            [
                'title' => 'Transit',
                'image' => ['path' => 'uploads/car-transit.png'],
                'links' => [
                    ['label' => 'Transit 2007 - 2012', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Transit-2007-2012.pdf'],
                    ['label' => 'Transit 2012 - 2018', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Transit-2012-nay.pdf'],
                ],
                'sort_order' => 6,
                'status' => 'ACTIVE'
            ],
            [
                'title' => 'Escape',
                'image' => ['path' => 'uploads/car-escape.png'],
                'links' => [
                    ['label' => 'Escape 2001 - 2013', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Escape-2001-2013.pdf'],
                ],
                'sort_order' => 7,
                'status' => 'ACTIVE'
            ],
            [
                'title' => 'Mondeo',
                'image' => ['path' => 'uploads/car-mondeo.png'],
                'links' => [
                    ['label' => 'Mondeo 2009 - 2013', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Mondeo-2009-2013.pdf'],
                ],
                'sort_order' => 8,
                'status' => 'ACTIVE'
            ],
            [
                'title' => 'Tourneo',
                'image' => ['path' => 'uploads/car-tourneo.png'],
                'links' => [
                    ['label' => 'Tourneo 2020', 'url' => 'https://www.ford.com.vn/content/dam/Ford/website-assets/ap/vn/Owner-Dashboard/Service%20&%20Maintainance/maintenance-schedule-plan/Tourneo-2020.pdf'],
                ],
                'sort_order' => 9,
                'status' => 'ACTIVE'
            ]
        ];

        foreach ($schedules as $s) {
            MaintenanceSchedule::create($s);
        }
    }
}
