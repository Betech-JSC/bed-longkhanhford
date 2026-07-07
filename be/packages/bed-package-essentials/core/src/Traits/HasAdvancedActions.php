<?php

namespace JamstackVietnam\Core\Traits;

use OpenSpout\Writer\Common\Creator\Style\StyleBuilder;
use Rap2hpoutre\FastExcel\FastExcel;

trait HasAdvancedActions
{
    public function export()
    {
        $this->checkAuthorize(__FUNCTION__);

        $headerStyle = (new StyleBuilder())
            ->setFontBold()
            ->build();

        $fileName = request()->getHost() . '_' . $this->getTable() . "_" . date('Y_m_d');

        return (new FastExcel($this->exportResourcesGenerator()))
            ->headerStyle($headerStyle)
            ->download("$fileName.xlsx");
    }

    function exportResourcesGenerator()
    {
        foreach ($this->model::cursor() as $item) {
            yield $item;
        }
    }
}
