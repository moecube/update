require 'json'
require 'digest'

result = []
Dir.glob('ygopro-update-win32-*.tar.xz') do |file|
  matched = file.match /ygopro-update-win32-(.+)\.tar\.xz/
  result.push({app_id: 'ygopro', version: matched[1], platform: 'win32', filename:file, hash: Digest::SHA256.file(file).hexdigest, size: File.size(file)})
  result.push({app_id: 'ygopro', version: matched[1], platform: 'win64', filename:file, hash: Digest::SHA256.file(file).hexdigest, size: File.size(file)})
end
puts JSON.dump result
