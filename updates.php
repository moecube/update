<?php
/**
 * Created by PhpStorm.
 * User: zh99998
 * Date: 16/2/12
 * Time: 下午8:14
 */

$platform = $_GET['platform'];
$updates = json_decode(file_get_contents('updates.json'));

$result = new SimpleXMLElement('<metalink/>', 0, false, 'urn:ietf:params:xml:ns:metalink');


foreach ($updates as $update) {
    foreach ($_GET as $app_id => $version) {
        if ($update->app_id == $app_id and $update->platform == $platform and $update->version > $version) {
            $file = $result->addChild('file');
            $file->addChild('size', $update->size);
            $file->addChild('identity', $update->app_id);
            $file->addChild('version', $update->version);
            $file->addChild('hash', $update->hash)->addAttribute('type', 'sha-256');
            $file->addChild('url', "http://downloads.my-card.in/apps-updates/$update->filename");
        }
    }
}

Header('Content-type: application/metalink4+xml');
print($result->asXML());

